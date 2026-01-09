import { Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../audit/audit.service';
import {
  CreateHouseholdDto,
  UpdateHouseholdDto,
  HouseholdQueryDto,
} from '@wedding/shared';

@Injectable()
export class HouseholdsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  /**
   * Generate a unique RSVP token and its hash
   */
  private generateRsvpToken(): { token: string; hash: string } {
    const token = randomBytes(32).toString('hex');
    const hash = createHash('sha256').update(token).digest('hex');
    return { token, hash };
  }

  /**
   * Query households with filters and pagination
   */
  async findAll(query: HouseholdQueryDto) {
    const where: any = {};

    // Search filter
    if (query.search) {
      where.OR = [
        { displayName: { contains: query.search, mode: 'insensitive' } },
        {
          guests: {
            some: {
              OR: [
                { firstName: { contains: query.search, mode: 'insensitive' } },
                { lastName: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
              ],
            },
          },
        },
      ];
    }

    // Status filter
    if (query.status === 'responded') {
      where.rsvpLastSubmittedAt = { not: null };
    } else if (query.status === 'not_responded') {
      where.rsvpLastSubmittedAt = null;
    }

    // Get total count
    const total = await this.prisma.household.count({ where });

    // Get paginated results
    const skip = (query.page - 1) * query.pageSize;
    const items = await this.prisma.household.findMany({
      where,
      skip,
      take: query.pageSize,
      include: {
        guests: {
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
        },
        _count: {
          select: {
            rsvpSubmissions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.ceil(total / query.pageSize),
    };
  }

  /**
   * Get single household by ID
   */
  async findOne(id: string) {
    const household = await this.prisma.household.findUnique({
      where: { id },
      include: {
        guests: {
          orderBy: [{ isPrimary: 'desc' }, { createdAt: 'asc' }],
        },
        rsvpSubmissions: {
          orderBy: { submittedAt: 'desc' },
          take: 10,
          include: {
            responses: {
              include: {
                guest: true,
              },
            },
            extras: true,
          },
        },
        changeRequests: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!household) {
      throw new NotFoundException('Household not found');
    }

    return household;
  }

  /**
   * Create new household with guests
   */
  async create(dto: CreateHouseholdDto, adminId: string) {
    const { token, hash } = this.generateRsvpToken();

    const household = await this.prisma.household.create({
      data: {
        displayName: dto.displayName,
        rsvpTokenHash: hash,
        notes: dto.notes || null,
        guests: {
          create: dto.guests.map((guest) => ({
            firstName: guest.firstName,
            lastName: guest.lastName,
            email: guest.email || null,
            phone: guest.phone || null,
            isPrimary: guest.isPrimary || false,
            attendanceRequiresGuestId: guest.attendanceRequiresGuestId || null,
          })),
        },
      },
      include: {
        guests: true,
      },
    });

    // Audit log
    await this.auditService.log({
      actorType: 'ADMIN',
      actorAdminId: adminId,
      action: 'HOUSEHOLD_CREATED',
      entityType: 'Household',
      entityId: household.id,
      metadata: {
        displayName: dto.displayName,
        guestCount: dto.guests.length,
      },
    });

    return {
      ...household,
      rsvpToken: token, // Return the raw token once for admin to send in invite
    };
  }

  /**
   * Update household
   */
  async update(id: string, dto: UpdateHouseholdDto, adminId: string) {
    const household = await this.prisma.household.update({
      where: { id },
      data: {
        displayName: dto.displayName,
        notes: dto.notes,
      },
      include: {
        guests: true,
      },
    });

    // Audit log
    await this.auditService.log({
      actorType: 'ADMIN',
      actorAdminId: adminId,
      action: 'HOUSEHOLD_UPDATED',
      entityType: 'Household',
      entityId: id,
      metadata: dto,
    });

    return household;
  }

  /**
   * Delete household (soft delete by adding to notes, or hard delete)
   */
  async remove(id: string, adminId: string) {
    await this.prisma.household.delete({
      where: { id },
    });

    // Audit log
    await this.auditService.log({
      actorType: 'ADMIN',
      actorAdminId: adminId,
      action: 'HOUSEHOLD_DELETED',
      entityType: 'Household',
      entityId: id,
      metadata: {},
    });

    return { ok: true };
  }
}
