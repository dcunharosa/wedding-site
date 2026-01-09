import { Controller, Get, Post, Patch, Delete, Param, Query, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { HouseholdsService } from './households.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import {
  CreateHouseholdDto,
  UpdateHouseholdDto,
  HouseholdQueryDto,
} from '@wedding/shared';

@ApiTags('admin')
@Controller('admin/households')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HouseholdsController {
  constructor(private householdsService: HouseholdsService) {}

  @Get()
  @ApiOperation({ summary: 'List all households' })
  @ApiResponse({ status: 200, description: 'Households returned' })
  async findAll(@Query() query: HouseholdQueryDto) {
    return this.householdsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get household by ID' })
  @ApiResponse({ status: 200, description: 'Household returned' })
  @ApiResponse({ status: 404, description: 'Household not found' })
  async findOne(@Param('id') id: string) {
    return this.householdsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new household' })
  @ApiResponse({ status: 201, description: 'Household created' })
  async create(@Body() dto: CreateHouseholdDto, @Req() req: any) {
    return this.householdsService.create(dto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update household' })
  @ApiResponse({ status: 200, description: 'Household updated' })
  @ApiResponse({ status: 404, description: 'Household not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateHouseholdDto,
    @Req() req: any,
  ) {
    return this.householdsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete household' })
  @ApiResponse({ status: 200, description: 'Household deleted' })
  @ApiResponse({ status: 404, description: 'Household not found' })
  async remove(@Param('id') id: string, @Req() req: any) {
    return this.householdsService.remove(id, req.user.id);
  }
}
