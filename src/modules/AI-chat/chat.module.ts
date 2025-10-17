import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { CategoryModule } from '../category/category.module';
import { ClientsModule } from '../clients/clients.module';
import { ClientsService } from '../clients/services/clients.service';
import { FilialsModule } from '../filials/filials.module';
import { FinanceModule } from '../finance/finance.module';
import { ProductModule } from '../product/product.module';
import { SalesModule } from '../sales/sales.module';
import { UserModule } from '../users/user.module';
import { WorkersModule } from '../workers/workers.module';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';

@Module({
  imports: [
    ProductModule,
    HttpModule,
    UserModule,
    ClientsModule,
    WorkersModule,
    CategoryModule,
    FinanceModule,
    FilialsModule,
    SalesModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
