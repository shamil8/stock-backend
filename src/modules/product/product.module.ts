import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QueryRunnerService } from '@app/database/services/query-runner.service';
import { LoggerModule } from '@app/logger/logger.module';

import { CategoryEntity } from '../category/entities/category.entity';
import { CategoryRepository } from '../category/repositories/category.repository';
import { FilialsProductsEntity } from '../filials/entities/filials-products.entity';
import { FilialsProductsRepository } from '../filials/repositories/filials-products.repository';
import { UserEntity } from '../users/entities/user.entity';
import { HistoriesController } from './controllers/histories.controller';
import { ProductController } from './controllers/product.controller';
import { StockMovementController } from './controllers/stock-movement.controller';
import { ProductEntity } from './entities/product.entity';
import { ProductHistoryEntity } from './entities/productHistory.entity';
import { StockMovementEntity } from './entities/stock-movement.entity';
import { HistoryRepository } from './repositories/history.repository';
import { ProductRepository } from './repositories/product.repository';
import { StockMovementRepository } from './repositories/stock-movement.repository';
import { HistoryService } from './services/history.service';
import { ProductService } from './services/product.service';
import { StockMovementService } from './services/stock-movement.service';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([
      ProductEntity,
      ProductHistoryEntity,
      UserEntity,
      CategoryEntity,
      StockMovementEntity,
      FilialsProductsEntity,
    ]),
  ],
  controllers: [
    ProductController,
    HistoriesController,
    StockMovementController,
  ],
  providers: [
    // repositories
    ProductRepository,
    HistoryRepository,
    CategoryRepository,
    StockMovementRepository,
    FilialsProductsRepository,

    // services
    ProductService,
    HistoryService,
    StockMovementService,
    QueryRunnerService,
  ],
  exports: [StockMovementService],
})
export class ProductModule {}
