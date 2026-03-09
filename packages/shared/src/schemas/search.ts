import { z } from 'zod';

export const searchRsvpSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
});

export type SearchRsvpDto = z.infer<typeof searchRsvpSchema>;
