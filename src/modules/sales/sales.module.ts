import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsModule } from '../clients/clients.module';
import { FinanceModule } from '../finance/finance.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../users/user.module';
import { SalesController } from './controllers/sales.controller';
import { SalesEntity } from './entities/sales.entity';
import { SalesItemEntity } from './entities/sales-item.entity';
import { SalesRepository } from './repositories/sales.repository';
import { SalesService } from './serivces/sales.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesEntity, SalesItemEntity]),
    ProductModule,
    UserModule,
    ClientsModule,
    FinanceModule,
  ],
  controllers: [SalesController],
  providers: [SalesService, SalesRepository],
})
export class SalesModule {}
