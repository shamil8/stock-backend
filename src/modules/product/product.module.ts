import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryRepository } from '../category/repositories/category.repository';
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
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductHistoryEntity,
      UserEntity,
      CategoryEntity,
    ]),
  ],
  controllers: [ProductController, HistoriesController],
  providers: [
    // repositories
    ProductRepository,
    HistoryRepository,
    CategoryRepository,

    // services
    ProductService,
    HistoryService,
  ],
})
export class ProductModule {}
