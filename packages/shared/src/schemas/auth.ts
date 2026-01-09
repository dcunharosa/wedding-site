import { z } from 'zod';
import { VALIDATION } from '../constants';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const createAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`),
  role: z.enum(['SUPER_ADMIN', 'ADMIN']).optional().default('ADMIN'),
});

export const updateAdminSchema = z.object({
  name: z.string().min(1).optional(),
  password: z
    .string()
    .min(VALIDATION.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`)
    .optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN']).optional(),
});

export type LoginDto = z.infer<typeof loginSchema>;
export type CreateAdminDto = z.infer<typeof createAdminSchema>;
export type UpdateAdminDto = z.infer<typeof updateAdminSchema>;
