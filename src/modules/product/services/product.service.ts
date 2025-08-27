import { Injectable } from '@nestjs/common';
import { QueryRunnerService } from '@app/database/services/query-runner.service';
import e from 'express';

import { CategoryRepository } from '../../category/repositories/category.repository';
import { FilialsProductsRepository } from '../../filials/repositories/filials-products.repository';
import { ProductCommand } from '../dto/command/product.command';
import { UpdateProductCommand } from '../dto/command/update-product.command';
import { ProductListQuery } from '../dto/query/product-list.query';
import { ProductResource } from '../dto/resources/product.resource';
import {
  ProductHistoryAction,
  ProductHistoryType,
} from '../enums/product-history.enum';
import { HistoryRepository } from '../repositories/history.repository';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly filialsProductsRepository: FilialsProductsRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly historyRepository: HistoryRepository,
    private readonly queryRunnerService: QueryRunnerService,
  ) {}

  async create(userId: string, data: ProductCommand): Promise<boolean> {
    const category = await this.categoryRepository.findById(data.name);

    const queryRunner = await this.queryRunnerService.create();

    try {
      await this.productRepository.create(data, queryRunner);

      await this.historyRepository.create(userId, {
        action: ProductHistoryAction.CREATE,
        entityType: ProductHistoryType.PRODUCT,
        description: `Created product ${data.name} to stock`,
        userId: userId,
        details: { category: category, brand: data.brand },
      }),
        queryRunner;

      await this.queryRunnerService.finish(queryRunner);

      return true;
    } catch (err: any) {
      await this.queryRunnerService.rollback(queryRunner);

      return err;
    }
  }

  async findOne(id: string): Promise<ProductResource> {
    return await this.productRepository.findById(id);
  }

  getAll(): Promise<ProductResource[]> {
    return this.productRepository.getAll();
  }

  async findProductsByCategory(id: string): Promise<ProductResource[]> {
    return await this.productRepository.findProductsByCategory(id);
  }

  async findByName(query: ProductListQuery): Promise<ProductResource[]> {
    return await this.productRepository.findByName(query);
  }

  async update(
    userId: string,
    id: string,
    command: UpdateProductCommand,
  ): Promise<boolean> {
    const product = await this.productRepository.findById(id);

    const historyCommand = {
      action: ProductHistoryAction.EDIT,
      entityType: ProductHistoryType.PRODUCT,
      description: `Edited product ${product.name} in stock`,
      userId: userId,
    };

    const queryRunner = await this.queryRunnerService.create();

    try {
      console.log('1111uuuppp');
      await this.productRepository.update(id, command);

      console.log('afffttteerrr upp');
      await this.historyRepository.create(userId, historyCommand);

      await this.queryRunnerService.finish(queryRunner);

      return true;
    } catch (err: any) {
      await this.queryRunnerService.rollback(queryRunner);

      return false;
    }
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const product = await this.productRepository.findById(id);

    const queryRunner = await this.queryRunnerService.create();

    try {
      await this.historyRepository.create(userId, {
        action: ProductHistoryAction.DELETE,
        entityType: ProductHistoryType.PRODUCT,
        description: `Deleted product ${product.name} from stock`,
        userId: userId,
        details: {},
      });

      return await this.productRepository.delete(id);

      await this.queryRunnerService.finish(queryRunner);
    } catch (err: any) {
      await this.queryRunnerService.rollback(queryRunner);

      return false;
    }
  }

  async getFilialByProduct(productId: string) {
    console.log('rpodudufdhfa', productId);

    return this.filialsProductsRepository.getFilialByProduct(productId);
  }
}
