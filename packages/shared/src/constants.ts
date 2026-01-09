// Constants used across the application

export const ACTOR_TYPES = {
  ADMIN: 'ADMIN',
  GUEST: 'GUEST',
  SYSTEM: 'SYSTEM',
} as const;

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
} as const;

export const CHANGE_REQUEST_STATUS = {
  NEW: 'NEW',
  HANDLED: 'HANDLED',
} as const;

export const AUDIT_ACTIONS = {
  // Household actions
  HOUSEHOLD_CREATED: 'HOUSEHOLD_CREATED',
  HOUSEHOLD_UPDATED: 'HOUSEHOLD_UPDATED',
  HOUSEHOLD_DELETED: 'HOUSEHOLD_DELETED',

  // Guest actions
  GUEST_CREATED: 'GUEST_CREATED',
  GUEST_UPDATED: 'GUEST_UPDATED',
  GUEST_DELETED: 'GUEST_DELETED',

  // RSVP actions
  RSVP_SUBMITTED: 'RSVP_SUBMITTED',
  RSVP_UPDATED: 'RSVP_UPDATED',
  CHANGE_REQUEST_SUBMITTED: 'CHANGE_REQUEST_SUBMITTED',

  // Invite actions
  INVITE_EMAIL_SENT: 'INVITE_EMAIL_SENT',
  INVITE_RESENT: 'INVITE_RESENT',

  // Gift actions
  GIFT_RECORDED: 'GIFT_RECORDED',
  GIFT_UPDATED: 'GIFT_UPDATED',
  GIFT_DELETED: 'GIFT_DELETED',

  // Content actions
  CONTENT_UPDATED: 'CONTENT_UPDATED',

  // Media actions
  MEDIA_UPLOADED: 'MEDIA_UPLOADED',
  MEDIA_UPDATED: 'MEDIA_UPDATED',
  MEDIA_DELETED: 'MEDIA_DELETED',

  // Auth actions
  ADMIN_LOGIN: 'ADMIN_LOGIN',
  ADMIN_LOGOUT: 'ADMIN_LOGOUT',
  ADMIN_LOGIN_FAILED: 'ADMIN_LOGIN_FAILED',
} as const;

export const CONTENT_KEYS = {
  HOME_HERO: 'HOME_HERO',
  SCHEDULE: 'SCHEDULE',
  VENUE: 'VENUE',
  GIFTS_PAGE: 'GIFTS_PAGE',
  FAQ: 'FAQ',
} as const;

export const STORAGE_PROVIDERS = {
  LOCAL: 'local',
  S3: 's3',
  R2: 'r2',
} as const;

export const EMAIL_PROVIDERS = {
  CONSOLE: 'console',
  SENDGRID: 'sendgrid',
  MAILGUN: 'mailgun',
  RESEND: 'resend',
} as const;

// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  TOKEN_LENGTH: 64,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as [string, ...string[]],
  PHONE_REGEX: /^\+?[1-9]\d{1,14}$/, // E.164 format
  SPOTIFY_URL_REGEX: /^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+$/,
} as const;
