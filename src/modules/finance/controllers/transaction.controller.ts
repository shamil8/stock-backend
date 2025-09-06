import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { TransactionCommand } from '../dto/command/transaction.command';
import { TransactionService } from '../services/transaction.service';

@ApiTags('Finance')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @ApiOperation({
    summary: 'Create transaction',
    description: 'Create transaction',
  })
  @ApiOperation({ summary: 'Add transaction' })
  addTransaction(@Body() command: TransactionCommand) {
    return this.transactionService.addTransaction(command);
  }
}
