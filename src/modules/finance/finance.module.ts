import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../users/user.module';
import { BorrowController } from './controllers/borrow.controller';
import { TransactionController } from './controllers/transaction.controller';
import { BorrowEntity } from './entities/borrows.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { BorrowsRepository } from './repositories/borrows.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { BorrowService } from './services/borrow.service';
import { TransactionService } from './services/transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity, BorrowEntity]),
    UserModule,
  ],
  controllers: [TransactionController, BorrowController],
  providers: [
    TransactionRepository,
    TransactionService,
    BorrowsRepository,
    BorrowService,
  ],
  exports: [TransactionService, BorrowsRepository, TransactionRepository],
})
export class FinanceModule {}
