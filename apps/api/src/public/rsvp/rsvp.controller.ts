import { Controller, Get, Post, Query, Body, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { RsvpService } from './rsvp.service';
import { RsvpSubmitDto, ChangeRequestDto, SearchRsvpDto } from '@wedding/shared';
import { Request } from 'express';

import { IsString, MinLength, MaxLength } from 'class-validator';

export class SearchRsvpLocalDto {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  name!: string;
}

@ApiTags('public')
@Controller('public/rsvp')
export class RsvpController {
  constructor(private rsvpService: RsvpService) { }

  @Get('household')
  @Throttle({ default: { limit: 20, ttl: 60000 } }) // 20 requests per minute
  @ApiOperation({ summary: 'Get household RSVP data' })
  @ApiQuery({ name: 't', description: 'RSVP token', required: true })
  @ApiResponse({ status: 200, description: 'Household data returned' })
  @ApiResponse({ status: 404, description: 'Invalid token' })
  async getHousehold(@Query('t') token: string) {
    return this.rsvpService.getHouseholdData(token);
  }

  @Post('search')
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 searches per minute
  @ApiOperation({ summary: 'Search for RSVP by guest name' })
  @ApiResponse({ status: 200, description: 'Search token returned' })
  @ApiResponse({ status: 404, description: 'Guest not found' })
  async search(@Body() dto: SearchRsvpLocalDto) {
    return this.rsvpService.searchHousehold(dto);
  }

  @Post('submit')
  @Throttle({ default: { limit: 5, ttl: 900000 } }) // 5 submissions per 15 minutes
  @ApiOperation({ summary: 'Submit RSVP' })
  @ApiQuery({ name: 't', description: 'RSVP token', required: true })
  @ApiResponse({ status: 200, description: 'RSVP submitted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 403, description: 'Deadline has passed' })
  @ApiResponse({ status: 404, description: 'Invalid token' })
  async submit(
    @Query('t') token: string,
    @Body() dto: RsvpSubmitDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    return this.rsvpService.submitRsvp(token, dto, ip, userAgent);
  }

  @Post('change-request')
  @Throttle({ default: { limit: 3, ttl: 3600000 } }) // 3 requests per hour
  @ApiOperation({ summary: 'Submit change request after deadline' })
  @ApiQuery({ name: 't', description: 'RSVP token', required: true })
  @ApiResponse({ status: 200, description: 'Change request submitted' })
  @ApiResponse({ status: 404, description: 'Invalid token' })
  async submitChangeRequest(
    @Query('t') token: string,
    @Body() dto: ChangeRequestDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || req.socket.remoteAddress;
    return this.rsvpService.submitChangeRequest(token, dto, ip);
  }
}
