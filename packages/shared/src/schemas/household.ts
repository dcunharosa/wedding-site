import { z } from 'zod';
import { VALIDATION } from '../constants';

export const createGuestSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email').optional().nullable(),
  phone: z
    .string()
    .regex(VALIDATION.PHONE_REGEX, 'Phone must be in E.164 format (e.g., +447700900123)')
    .optional()
    .nullable(),
  isPrimary: z.boolean().optional().default(false),
  attendanceRequiresGuestId: z.string().uuid().optional().nullable(),
});

export const updateGuestSchema = createGuestSchema.partial();

export const createHouseholdSchema = z.object({
  displayName: z.string().min(1, 'Display name is required'),
  notes: z.string().optional().nullable(),
  guests: z.array(createGuestSchema).min(1, 'At least one guest is required'),
});

export const updateHouseholdSchema = z.object({
  displayName: z.string().min(1).optional(),
  notes: z.string().optional().nullable(),
});

export const householdQuerySchema = z.object({
  search: z.string().optional(),
  status: z.enum(['responded', 'not_responded', 'all']).optional().default('all'),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(20),
});

export type CreateGuestDto = z.infer<typeof createGuestSchema>;
export type UpdateGuestDto = z.infer<typeof updateGuestSchema>;
export type CreateHouseholdDto = z.infer<typeof createHouseholdSchema>;
export type UpdateHouseholdDto = z.infer<typeof updateHouseholdSchema>;
export type HouseholdQueryDto = z.infer<typeof householdQuerySchema>;
