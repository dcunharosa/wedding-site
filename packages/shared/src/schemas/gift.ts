import { z } from 'zod';

export const createGiftSchema = z.object({
  householdId: z.string().uuid('Invalid household ID'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 characters (e.g., GBP, USD)').default('GBP'),
  receivedAt: z.string().datetime().or(z.date()),
  notes: z.string().max(1000).optional().nullable(),
});

export const updateGiftSchema = z.object({
  amount: z.number().positive().optional(),
  currency: z.string().length(3).optional(),
  receivedAt: z.string().datetime().or(z.date()).optional(),
  notes: z.string().max(1000).optional().nullable(),
});

export const giftQuerySchema = z.object({
  householdId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(50),
});

export type CreateGiftDto = z.infer<typeof createGiftSchema>;
export type UpdateGiftDto = z.infer<typeof updateGiftSchema>;
export type GiftQueryDto = z.infer<typeof giftQuerySchema>;
