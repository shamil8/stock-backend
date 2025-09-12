import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RequestInterface } from '../../auth/interfaces/request.interface';
import { TransactionCommand } from '../dto/command/transaction.command';
import { UpdateTransactionCommand } from '../dto/command/update-transaction.command';
import { TransactionService } from '../services/transaction.service';

@ApiTags('Transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create transaction',
    description: 'Create transaction',
  })
  @ApiOperation({ summary: 'Add transaction' })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  addTransaction(
    @Request() { user }: RequestInterface,
    @Body() command: TransactionCommand,
  ) {
    return this.transactionService.addTransaction(user.id, command);
  }

  @Get('/analytics')
  @ApiOperation({
    summary: 'Get analytics',
    description: 'Get all analytics',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  getMonthlySummary() {
    const year = new Date().getFullYear();

    return this.transactionService.getMonthlySummary(year);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all transactions',
    description: 'Get all transactions',
  })
  // @UseGuards(JwtAccessGuard)
  // @ApiBearerAuth()
  getAllTransactions() {
    return this.transactionService.getAll();
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update transaction',
    description: 'Update transaction by id',
  })
  // @UseGuards(JwtAccessGuard)
  // @ApiBearerAuth()
  updateTransaction(
    @Param('id') id: string,
    @Body() command: UpdateTransactionCommand,
  ) {
    return this.transactionService.updateTransaction(id, command);
  }
}
