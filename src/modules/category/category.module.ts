import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryController } from './controllers/category.controller';
import { CategoryEntity } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoryService, CategoryRepository],
  controllers: [CategoryController],
  exports: [CategoryService],
})
export class CategoryModule {}
