import { z } from 'zod';

export const searchRsvpSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
});

export type SearchRsvpDto = z.infer<typeof searchRsvpSchema>;
