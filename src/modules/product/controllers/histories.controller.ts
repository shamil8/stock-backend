import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { HistoryCommand } from '../dto/command/history.command';
import { HistoryResource } from '../dto/resources/history-resource';
import { HistoryService } from '../services/history.service';

@ApiTags('Histories')
@Controller('histories')
export class HistoriesController {
  constructor(private readonly historyService: HistoryService) {}
  @Put()
  @ApiOperation({
    summary: 'Create history',
    description: 'Create a new history',
  })
  @ApiOkResponse({
    type: HistoryResource,
    description: 'Successfully created history',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  history(@Body() dto: HistoryCommand): Promise<HistoryResource> {
    return this.historyService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'All history.',
    description: 'Gets a list of all histories.',
  })
  @ApiOkResponse({
    type: HistoryResource,
    description: 'Got a list of all histories',
  })
  getAllHistories(): Promise<HistoryResource[]> {
    return this.historyService.gelAll();
  }
}
