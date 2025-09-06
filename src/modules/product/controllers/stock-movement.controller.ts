import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RequestInterface } from '../../auth/interfaces/request.interface';
import { StockInCommand } from '../dto/command/stock-in.command';
import { StockMovementResource } from '../dto/resources/movement.stock.resource';
import { StockMovementService } from '../services/stock-movement.service';

@ApiTags('Stock Movement')
@Controller('movement')
export class StockMovementController {
  constructor(private readonly sMovementService: StockMovementService) {}

  @Get()
  @ApiOperation({
    summary: 'Get Stock Movement',
    description: 'Get all stock movements',
  })
  @ApiOkResponse({
    description: 'Got all stock movements',
    type: StockMovementResource,
  })
  get(): Promise<StockMovementResource[]> {
    return this.sMovementService.getAll();
  }

  @Post('/:id')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Save stock in',
    description: 'Save stock in for product',
  })
  @ApiOkResponse({
    type: StockMovementResource,
    description: 'Saved stock in for product successfully',
  })
  stockIn(
    @Request() { user }: RequestInterface,
    @Param('id') id: string,
    @Body() command: StockInCommand,
  ): Promise<StockMovementResource | boolean> {
    return this.sMovementService.stockIn(user.id, id, command);
  }

  @Post('out/:id')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Save stock out',
    description: 'Save stock out for product',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'Saved stock out for product successfully',
  })
  stockOut(
    @Request() { user }: RequestInterface,
    @Param('id') id: string,
    @Body() command: StockInCommand,
  ): Promise<StockMovementResource | boolean> {
    return this.sMovementService.stockOut(user.id, id, command);
  }
}
