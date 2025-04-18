import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '../users/entities/user.entity';
import { HistoriesController } from './controllers/histories.controller';
import { ProductController } from './controllers/product.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductHistoryEntity } from './entities/productHistory.entity';
import { HistoryRepository } from './repositories/history.repository';
import { ProductRepository } from './repositories/product.repository';
import { HistoryService } from './services/history.service';
import { ProductService } from './services/product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, ProductHistoryEntity, UserEntity]),
  ],
  controllers: [ProductController, HistoriesController],
  providers: [
    ProductService,
    ProductRepository,
    HistoryRepository,
    HistoryService,
  ],
})
export class ProductModule {}
