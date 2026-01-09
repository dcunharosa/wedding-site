import { z } from 'zod';
import { VALIDATION } from '../constants';

export const rsvpGuestResponseSchema = z.object({
  guestId: z.string().uuid('Invalid guest ID'),
  attending: z.boolean(),
  dietaryRestrictions: z.string().max(500, 'Dietary restrictions too long').optional().nullable(),
});

export const rsvpSubmitSchema = z.object({
  responses: z.array(rsvpGuestResponseSchema).min(1, 'At least one response is required'),
  songRequestText: z.string().max(200, 'Song request text too long').optional().nullable(),
  songRequestSpotifyUrl: z
    .string()
    .regex(VALIDATION.SPOTIFY_URL_REGEX, 'Invalid Spotify URL format')
    .optional()
    .nullable(),
});

export const changeRequestSchema = z.object({
  message: z.string().min(1, 'Message is required').max(1000, 'Message too long'),
});

export const rsvpTokenQuerySchema = z.object({
  t: z.string().length(VALIDATION.TOKEN_LENGTH, 'Invalid token format'),
});

export const rsvpQuerySchema = z.object({
  householdId: z.string().uuid().optional(),
  attending: z.enum(['yes', 'no', 'all']).optional().default('all'),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(50),
});

export type RsvpGuestResponseDto = z.infer<typeof rsvpGuestResponseSchema>;
export type RsvpSubmitDto = z.infer<typeof rsvpSubmitSchema>;
export type ChangeRequestDto = z.infer<typeof changeRequestSchema>;
export type RsvpTokenQueryDto = z.infer<typeof rsvpTokenQuerySchema>;
export type RsvpQueryDto = z.infer<typeof rsvpQuerySchema>;
