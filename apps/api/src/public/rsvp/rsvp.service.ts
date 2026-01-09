import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { createHash } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { ConfigService } from '../../config/config.service';
import { AuditService } from '../../audit/audit.service';
import { RsvpSubmitDto, ChangeRequestDto, HouseholdWithGuests, GuestWithResponse } from '@wedding/shared';

@Injectable()
export class RsvpService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private auditService: AuditService,
  ) {}

  /**
   * Hash an RSVP token using SHA-256
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /**
   * Check if RSVP deadline has passed
   */
  private isDeadlinePassed(): boolean {
    const deadline = this.configService.rsvpDeadline;
    return new Date() > deadline;
  }

  /**
   * Validate token and get household
   */
  async validateToken(token: string) {
    const tokenHash = this.hashToken(token);

    const household = await this.prisma.household.findUnique({
      where: { rsvpTokenHash: tokenHash },
      include: {
        guests: {
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
        },
      },
    });

    if (!household) {
      throw new NotFoundException('Invalid RSVP link');
    }

    return household;
  }

  /**
   * Get household data with current RSVP state
   */
  async getHouseholdData(token: string): Promise<HouseholdWithGuests> {
    const household = await this.validateToken(token);

    // Get latest RSVP submission
    const latestSubmission = await this.prisma.rsvpSubmission.findFirst({
      where: { householdId: household.id },
      orderBy: { submittedAt: 'desc' },
      include: {
        responses: true,
        extras: true,
      },
    });

    // Build guests with current responses
    const guests: GuestWithResponse[] = household.guests.map((guest: any) => {
      const response = latestSubmission?.responses.find((r: any) => r.guestId === guest.id);

      return {
        id: guest.id,
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        isPrimary: guest.isPrimary,
        attendanceRequiresGuestId: guest.attendanceRequiresGuestId,
        currentResponse: response
          ? {
              attending: response.attending,
              dietaryRestrictions: response.dietaryRestrictions,
            }
          : undefined,
      };
    });

    const deadline = this.configService.rsvpDeadline;
    const deadlinePassed = this.isDeadlinePassed();

    return {
      id: household.id,
      displayName: household.displayName,
      guests,
      extras: latestSubmission?.extras
        ? {
            songRequestText: latestSubmission.extras.songRequestText,
            songRequestSpotifyUrl: latestSubmission.extras.songRequestSpotifyUrl,
          }
        : undefined,
      canEdit: !deadlinePassed,
      deadlineInfo: {
        deadline: deadline.toISOString(),
        passed: deadlinePassed,
      },
    };
  }

  /**
   * Enforce dependency rule: dependent guest cannot attend if required guest is not attending
   */
  private enforceDependencyRules<T extends { guestId: string; attending: boolean }>(
    guests: { id: string; attendanceRequiresGuestId: string | null }[],
    responses: T[],
  ): { corrected: { guestId: string; reason: string; correctedValue: boolean }[]; responses: T[] } {
    const corrected: { guestId: string; reason: string; correctedValue: boolean }[] = [];
    const responseMap = new Map(responses.map((r) => [r.guestId, r.attending]));

    for (const guest of guests) {
      if (guest.attendanceRequiresGuestId) {
        const requiredGuestAttending = responseMap.get(guest.attendanceRequiresGuestId);
        const dependentAttending = responseMap.get(guest.id);

        // If required guest is NOT attending, force dependent to NOT attend
        if (requiredGuestAttending === false && dependentAttending === true) {
          // Find and correct the response
          const responseIndex = responses.findIndex((r) => r.guestId === guest.id);
          if (responseIndex !== -1) {
            responses[responseIndex].attending = false;
            corrected.push({
              guestId: guest.id,
              reason: 'Dependent guest cannot attend without required guest',
              correctedValue: false,
            });
          }
        }
      }
    }

    return { corrected, responses };
  }

  /**
   * Submit RSVP
   */
  async submitRsvp(
    token: string,
    dto: RsvpSubmitDto,
    ip?: string,
    userAgent?: string,
  ): Promise<{
    ok: boolean;
    submittedAt: string;
    corrected?: any[];
  }> {
    // Check deadline
    if (this.isDeadlinePassed()) {
      throw new ForbiddenException(
        'RSVP deadline has passed. Please submit a change request instead.',
      );
    }

    const household = await this.validateToken(token);

    // Validate all guest IDs belong to this household
    const guestIds = new Set(household.guests.map((g: any) => g.id));
    const invalidGuests = dto.responses.filter((r) => !guestIds.has(r.guestId));
    if (invalidGuests.length > 0) {
      throw new BadRequestException('Invalid guest IDs in responses');
    }

    // Enforce dependency rules
    const { corrected, responses } = this.enforceDependencyRules(
      household.guests.map((g: any) => ({
        id: g.id,
        attendanceRequiresGuestId: g.attendanceRequiresGuestId,
      })),
      dto.responses,
    );

    // Check song request feature toggle
    const songRequestEnabled = this.configService.songRequestEnabled;
    const songRequestText = songRequestEnabled ? dto.songRequestText : null;
    const songRequestSpotifyUrl = songRequestEnabled ? dto.songRequestSpotifyUrl : null;

    // Create RSVP submission
    const submission = await this.prisma.rsvpSubmission.create({
      data: {
        householdId: household.id,
        actorType: 'GUEST',
        ip: ip || null,
        userAgent: userAgent || null,
        responses: {
          create: responses.map((r) => ({
            guestId: r.guestId,
            attending: r.attending,
            dietaryRestrictions: r.dietaryRestrictions || null,
          })),
        },
        extras:
          songRequestText || songRequestSpotifyUrl
            ? {
                create: {
                  songRequestText,
                  songRequestSpotifyUrl,
                },
              }
            : undefined,
      },
      include: {
        responses: true,
        extras: true,
      },
    });

    // Update household last submitted timestamp
    await this.prisma.household.update({
      where: { id: household.id },
      data: { rsvpLastSubmittedAt: submission.submittedAt },
    });

    // Calculate attending counts for audit log
    const attendingCount = responses.filter((r) => r.attending).length;
    const notAttendingCount = responses.filter((r) => !r.attending).length;

    // Create audit log
    await this.auditService.log({
      actorType: 'GUEST',
      householdId: household.id,
      action: 'RSVP_SUBMITTED',
      entityType: 'RsvpSubmission',
      entityId: submission.id,
      metadata: {
        attending: attendingCount,
        notAttending: notAttendingCount,
        hasSongRequest: !!(songRequestText || songRequestSpotifyUrl),
        ip,
      },
    });

    return {
      ok: true,
      submittedAt: submission.submittedAt.toISOString(),
      ...(corrected.length > 0 ? { corrected } : {}),
    };
  }

  /**
   * Submit change request after deadline
   */
  async submitChangeRequest(
    token: string,
    dto: ChangeRequestDto,
    ip?: string,
  ): Promise<{ ok: boolean }> {
    const household = await this.validateToken(token);

    // Create change request
    const changeRequest = await this.prisma.changeRequest.create({
      data: {
        householdId: household.id,
        message: dto.message,
        status: 'NEW',
      },
    });

    // Log in audit
    await this.auditService.log({
      actorType: 'GUEST',
      householdId: household.id,
      action: 'CHANGE_REQUEST_SUBMITTED',
      entityType: 'ChangeRequest',
      entityId: changeRequest.id,
      metadata: {
        message: dto.message,
        ip,
      },
    });

    // TODO: Send notification email to couple
    // This would be handled by an email service

    return { ok: true };
  }
}
