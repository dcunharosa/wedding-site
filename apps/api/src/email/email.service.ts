import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { ConfigService } from '../config/config.service';

export interface RsvpNotificationData {
  householdName: string;
  guests: Array<{
    name: string;
    attending: boolean;
    dietary?: string | null;
  }>;
  songRequest?: string | null;
  submittedAt: string;
}

export interface ChangeRequestNotificationData {
  householdName: string;
  message: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend: Resend | null = null;

  constructor(private config: ConfigService) {
    if (config.emailProvider === 'resend' && config.resendApiKey) {
      this.resend = new Resend(config.resendApiKey);
    }
  }

  async notifyRsvpSubmitted(data: RsvpNotificationData): Promise<void> {
    const to = this.config.coupleNotifyEmails;
    if (!to.length) return;

    const attending = data.guests.filter((g) => g.attending);
    const declining = data.guests.filter((g) => !g.attending);

    const attendingLabel =
      attending.length > 0
        ? `${attending.length} attending`
        : 'not attending';

    const subject = `RSVP: ${data.householdName} — ${attendingLabel}`;

    const guestRows = data.guests
      .map((g) => {
        const icon = g.attending ? '✅' : '❌';
        const dietary = g.dietary ? ` &nbsp;·&nbsp; <em>${g.dietary}</em>` : '';
        return `<li>${icon} <strong>${g.name}</strong>${dietary}</li>`;
      })
      .join('');

    const songRow = data.songRequest
      ? `<p style="margin-top:16px"><strong>Song request:</strong> ${data.songRequest}</p>`
      : '';

    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
        <h2 style="margin-bottom:4px">New RSVP received</h2>
        <p style="color:#666;margin-top:0">
          ${new Date(data.submittedAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <p><strong>Household:</strong> ${data.householdName}</p>
        <p><strong>Attending:</strong> ${attending.length} &nbsp;·&nbsp; <strong>Not attending:</strong> ${declining.length}</p>
        <ul style="padding-left:20px;line-height:1.8">${guestRows}</ul>
        ${songRow}
      </div>
    `;

    await this.send({ to, subject, html });
  }

  async notifyChangeRequest(data: ChangeRequestNotificationData): Promise<void> {
    const to = this.config.coupleNotifyEmails;
    if (!to.length) return;

    const subject = `Change request: ${data.householdName}`;

    const html = `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1a1a1a">
        <h2 style="margin-bottom:4px">Change request received</h2>
        <hr style="border:none;border-top:1px solid #eee;margin:16px 0"/>
        <p><strong>Household:</strong> ${data.householdName}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="border-left:3px solid #ccc;margin:0;padding:8px 16px;color:#555">
          ${data.message}
        </blockquote>
      </div>
    `;

    await this.send({ to, subject, html });
  }

  private async send(params: {
    to: string[];
    subject: string;
    html: string;
  }): Promise<void> {
    if (this.config.emailProvider === 'resend' && this.resend) {
      try {
        const { error } = await this.resend.emails.send({
          from: `${this.config.emailFromName} <${this.config.emailFrom}>`,
          to: params.to,
          subject: params.subject,
          html: params.html,
        });
        if (error) {
          this.logger.error('Resend error', error);
        }
      } catch (err) {
        this.logger.error('Failed to send email', err);
      }
    } else {
      // Console fallback for development / unconfigured providers
      this.logger.log(
        `[EMAIL] To: ${params.to.join(', ')} | Subject: ${params.subject}`,
      );
    }
  }
}
