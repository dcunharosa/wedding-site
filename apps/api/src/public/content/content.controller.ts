import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CONTENT_KEYS } from '@wedding/shared';

@ApiTags('public')
@Controller('public/content')
export class ContentController {
  constructor(private contentService: ContentService) {}

  @Get()
  @ApiOperation({ summary: 'Get public content pages' })
  @ApiQuery({
    name: 'keys',
    required: false,
    description: 'Comma-separated content keys',
    example: 'HOME_HERO,SCHEDULE,VENUE',
  })
  @ApiResponse({ status: 200, description: 'Content returned' })
  async getContent(@Query('keys') keysParam?: string) {
    const keys = keysParam
      ? keysParam.split(',')
      : Object.values(CONTENT_KEYS);

    return this.contentService.getContent(keys);
  }
}
