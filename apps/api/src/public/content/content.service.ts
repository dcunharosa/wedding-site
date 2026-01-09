import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get content by keys
   */
  async getContent(keys: string[]) {
    const content = await this.prisma.content.findMany({
      where: {
        key: {
          in: keys,
        },
      },
      select: {
        key: true,
        json: true,
        updatedAt: true,
      },
    });

    // Transform to key-value map
    const result: Record<string, unknown> = {};
    for (const item of content) {
      result[item.key] = item.json;
    }
    return result;
  }
}
