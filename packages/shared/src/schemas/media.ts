import { z } from 'zod';
import { VALIDATION } from '../constants';

export const requestUploadUrlSchema = z.object({
  filename: z.string().min(1, 'Filename is required'),
  mimeType: z.enum(['image/jpeg', 'image/png', 'image/webp'], {
    errorMap: () => ({ message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' }),
  }),
  fileSize: z.number().int().positive().max(VALIDATION.MAX_FILE_SIZE, 'File size exceeds 10MB limit'),
});

export const registerMediaSchema = z.object({
  storageKey: z.string().min(1, 'Storage key is required'),
  url: z.string().url('Invalid URL'),
  altText: z.string().max(200).optional().nullable(),
  caption: z.string().max(500).optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
  mimeType: z.string().min(1, 'MIME type is required'),
});

export const updateMediaSchema = z.object({
  altText: z.string().max(200).optional().nullable(),
  caption: z.string().max(500).optional().nullable(),
  focalX: z.number().min(0).max(1).optional().nullable(),
  focalY: z.number().min(0).max(1).optional().nullable(),
});

export const mediaQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(30),
  sortBy: z.enum(['createdAt', 'filename']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type RequestUploadUrlDto = z.infer<typeof requestUploadUrlSchema>;
export type RegisterMediaDto = z.infer<typeof registerMediaSchema>;
export type UpdateMediaDto = z.infer<typeof updateMediaSchema>;
export type MediaQueryDto = z.infer<typeof mediaQuerySchema>;
