import { Body, Controller, Get, Put, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RequestInterface } from '../../auth/interfaces/request.interface';
import { HistoryCommand } from '../dto/command/history.command';
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
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  history(@Request() { user }: RequestInterface, @Body() dto: HistoryCommand) {
    console.log('Saloommmmmmmm', user);

    return this.historyService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'All history.',
    description: 'Gets a list of all histories.',
  })
  getAllHistories() {
    return this.historyService.gelAll();
  }
}
