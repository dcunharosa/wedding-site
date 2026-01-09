import { z } from 'zod';
import { AUDIT_ACTIONS } from '../constants';

export const auditQuerySchema = z.object({
  search: z.string().optional(),
  action: z.string().optional(),
  actorType: z.enum(['ADMIN', 'GUEST', 'SYSTEM', 'all']).optional().default('all'),
  householdId: z.string().uuid().optional(),
  dateFrom: z.string().datetime().optional(),
  dateTo: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().positive().max(100).optional().default(50),
});

export const createAuditLogSchema = z.object({
  actorType: z.enum(['ADMIN', 'GUEST', 'SYSTEM']),
  actorAdminId: z.string().uuid().optional().nullable(),
  householdId: z.string().uuid().optional().nullable(),
  action: z.nativeEnum(AUDIT_ACTIONS),
  entityType: z.string().min(1),
  entityId: z.string().min(1),
  metadata: z.record(z.unknown()).optional().nullable(),
});

export type AuditQueryDto = z.infer<typeof auditQuerySchema>;
export type CreateAuditLogDto = z.infer<typeof createAuditLogSchema>;
