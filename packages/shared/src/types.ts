// Shared TypeScript types

export type ActorType = 'ADMIN' | 'GUEST' | 'SYSTEM';
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN';
export type ChangeRequestStatus = 'NEW' | 'HANDLED';
export type StorageProvider = 'local' | 's3' | 'r2';
export type EmailProvider = 'console' | 'sendgrid' | 'mailgun' | 'resend';

// API Response types
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Authentication types
export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: AdminRole;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: string;
}

// RSVP types
export interface RsvpTokenValidation {
  isValid: boolean;
  householdId?: string;
  canEdit: boolean;
  deadlinePassed: boolean;
}

export interface GuestWithResponse {
  id: string;
  firstName: string;
  lastName: string;
  email?: string | null;
  isPrimary: boolean;
  attendanceRequiresGuestId?: string | null;
  currentResponse?: {
    attending: boolean;
    dietaryRestrictions?: string | null;
  };
}

export interface HouseholdWithGuests {
  id: string;
  displayName: string;
  guests: GuestWithResponse[];
  extras?: {
    songRequestText?: string | null;
    songRequestSpotifyUrl?: string | null;
  };
  canEdit: boolean;
  deadlineInfo: {
    deadline: string;
    passed: boolean;
  };
}

// Export CSV types
export interface CsvExportOptions {
  filename: string;
  headers: string[];
  rows: (string | number | null)[][];
}

// Media types
export interface SignedUploadUrl {
  uploadUrl: string;
  storageKey: string;
  publicUrl: string;
  expiresAt: string;
}

export interface MediaAssetWithUrl {
  id: string;
  url: string;
  altText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  mimeType: string;
  focalX?: number | null;
  focalY?: number | null;
  createdAt: string;
}

// Email types
export interface EmailTemplate {
  subject: string;
  htmlBody: string;
  textBody: string;
  variables: Record<string, string>;
}

export interface EmailSendRequest {
  to: string[];
  subject: string;
  html: string;
  text: string;
  from?: string;
  fromName?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// Statistics types
export interface DashboardStats {
  totalHouseholds: number;
  totalGuests: number;
  respondedHouseholds: number;
  notRespondedHouseholds: number;
  attendingGuests: number;
  notAttendingGuests: number;
  totalGifts: number;
  totalGiftAmount: number;
  dietarySummary: {
    restriction: string;
    count: number;
  }[];
}

// Content types
export type ContentKey = 'HOME_HERO' | 'SCHEDULE' | 'VENUE' | 'GIFTS_PAGE' | 'FAQ';

export interface ContentData {
  [key: string]: unknown;
}
