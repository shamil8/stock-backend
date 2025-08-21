import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { IdParamDto } from '@app/crypto-utils/dto/params/id-param.dto';

import { StockInCommand } from '../dto/command/stock-in.command';
import { StockMovementService } from '../services/stock-movement.service';

@ApiTags('Stock Movement')
@Controller('movement')
export class StockMovementController {
  constructor(private readonly sMovementService: StockMovementService) {}

  @Post('/:id')
  @ApiOperation({
    summary: 'Save stock in',
    description: 'Save stock in for product',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'Saved stock in for product successfully',
  })
  stockIn(
    @Param('id') id: string,
    @Body() command: StockInCommand,
  ): Promise<boolean> {
    return this.sMovementService.stockIn(id, command);
  }

  @Post('out/:id')
  @ApiOperation({
    summary: 'Save stock out',
    description: 'Save stock out for product',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'Saved stock out for product successfully',
  })
  stockOut(
    @Param('id') id: string,
    @Body() command: StockInCommand,
  ): Promise<boolean> {
    return this.sMovementService.stockOut(id, command);
  }
}
