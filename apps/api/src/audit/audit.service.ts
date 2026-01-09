import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto, AuditQueryDto } from '@wedding/shared';
import { ActorType, Prisma } from '@prisma/client';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create an audit log entry
   */
  async log(dto: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        actorType: dto.actorType as unknown as ActorType,
        actorAdminId: dto.actorAdminId || null,
        householdId: dto.householdId || null,
        action: dto.action as string,
        entityType: dto.entityType,
        entityId: dto.entityId,
        metadata: dto.metadata as Prisma.InputJsonValue ?? Prisma.JsonNull,
      },
    });
  }

  /**
   * Query audit logs with filters and pagination
   */
  async query(query: AuditQueryDto) {
    const where: any = {};

    // Apply filters
    if (query.action) {
      where.action = query.action;
    }

    if (query.actorType && query.actorType !== 'all') {
      where.actorType = query.actorType;
    }

    if (query.householdId) {
      where.householdId = query.householdId;
    }

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {};
      if (query.dateFrom) {
        where.createdAt.gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        where.createdAt.lte = new Date(query.dateTo);
      }
    }

    if (query.search) {
      where.OR = [
        { entityType: { contains: query.search, mode: 'insensitive' } },
        { entityId: { contains: query.search, mode: 'insensitive' } },
        { action: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await this.prisma.auditLog.count({ where });

    // Get paginated results
    const skip = (query.page - 1) * query.pageSize;
    const items = await this.prisma.auditLog.findMany({
      where,
      skip,
      take: query.pageSize,
      orderBy: { createdAt: 'desc' },
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        household: {
          select: {
            id: true,
            displayName: true,
          },
        },
      },
    });

    return {
      items,
      total,
      page: query.page,
      pageSize: query.pageSize,
      totalPages: Math.ceil(total / query.pageSize),
    };
  }
}
