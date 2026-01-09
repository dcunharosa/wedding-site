import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  // Database
  get databaseUrl(): string {
    return process.env.DATABASE_URL || '';
  }

  // JWT
  get jwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret && process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    return secret || 'default-secret-change-me';
  }

  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '7d';
  }

  // RSVP Configuration
  get rsvpDeadline(): Date {
    return new Date(process.env.RSVP_DEADLINE_AT || '2026-06-01T23:59:59Z');
  }

  get songRequestEnabled(): boolean {
    return process.env.SONG_REQUEST_ENABLED === 'true';
  }

  // Email
  get emailProvider(): string {
    return process.env.EMAIL_PROVIDER || 'console';
  }

  get emailFrom(): string {
    return process.env.EMAIL_FROM || 'noreply@wedding.com';
  }

  get emailFromName(): string {
    return process.env.EMAIL_FROM_NAME || 'Wedding';
  }

  get coupleNotifyEmails(): string[] {
    const emails = process.env.COUPLE_NOTIFY_EMAILS || '';
    return emails.split(',').filter(Boolean);
  }

  // SendGrid
  get sendgridApiKey(): string {
    return process.env.SENDGRID_API_KEY || '';
  }

  // Mailgun
  get mailgunApiKey(): string {
    return process.env.MAILGUN_API_KEY || '';
  }

  get mailgunDomain(): string {
    return process.env.MAILGUN_DOMAIN || '';
  }

  // Resend
  get resendApiKey(): string {
    return process.env.RESEND_API_KEY || '';
  }

  // Storage
  get storageProvider(): string {
    return process.env.STORAGE_PROVIDER || 'local';
  }

  get storageLocalPath(): string {
    return process.env.STORAGE_LOCAL_PATH || './uploads';
  }

  get storageBaseUrl(): string {
    return process.env.STORAGE_BASE_URL || 'http://localhost:3001/uploads';
  }

  // AWS/S3/R2
  get awsAccessKeyId(): string {
    return process.env.AWS_ACCESS_KEY_ID || '';
  }

  get awsSecretAccessKey(): string {
    return process.env.AWS_SECRET_ACCESS_KEY || '';
  }

  get awsRegion(): string {
    return process.env.AWS_REGION || 'us-east-1';
  }

  get awsBucketName(): string {
    return process.env.AWS_BUCKET_NAME || '';
  }

  get awsEndpoint(): string | undefined {
    return process.env.AWS_ENDPOINT || undefined;
  }

  // Redis
  get redisUrl(): string {
    return process.env.REDIS_URL || 'redis://localhost:6379';
  }

  // Rate Limiting
  get rateLimitRsvpMax(): number {
    return parseInt(process.env.RATE_LIMIT_RSVP_MAX || '10', 10);
  }
}
