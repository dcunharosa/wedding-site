import { z } from 'zod';
import { CONTENT_KEYS } from '../constants';

export const contentKeysQuerySchema = z.object({
  keys: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(',') : Object.values(CONTENT_KEYS))),
});

export const updateContentSchema = z.object({
  json: z.record(z.unknown()),
});

export const contentKeyParamSchema = z.object({
  key: z.enum([
    CONTENT_KEYS.HOME_HERO,
    CONTENT_KEYS.SCHEDULE,
    CONTENT_KEYS.VENUE,
    CONTENT_KEYS.GIFTS_PAGE,
    CONTENT_KEYS.FAQ,
  ]),
});

export type ContentKeysQueryDto = z.infer<typeof contentKeysQuerySchema>;
export type UpdateContentDto = z.infer<typeof updateContentSchema>;
export type ContentKeyParamDto = z.infer<typeof contentKeyParamSchema>;
