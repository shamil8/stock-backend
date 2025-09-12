import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/user.module';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([TransactionEntity]), UserModule],
  controllers: [TransactionController],
  providers: [TransactionRepository, TransactionService],
  exports: [TransactionService],
})
export class FinanceModule {}
