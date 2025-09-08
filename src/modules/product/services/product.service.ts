import { HttpStatus, Injectable } from '@nestjs/common';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { CategoryRepository } from '../../category/repositories/category.repository';
import { FilialsProductsRepository } from '../../filials/repositories/filials-products.repository';
import { ProductCommand } from '../dto/command/product.command';
import { UpdateProductCommand } from '../dto/command/update-product.command';
import { ProductListQuery } from '../dto/query/product-list.query';
import {
  ProductResource,
  ProductStoreResource,
} from '../dto/resources/product.resource';
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
    private readonly filialProductsRepository: FilialsProductsRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly historyRepository: HistoryRepository,
  ) {}

  async create(
    userId: string,
    command: ProductCommand,
  ): Promise<ProductResource> {
    const product = await this.productRepository.findByName(command.name);

    if (product) {
      throw new AppHttpException(
        ExceptionMessage.PRODUCT_EXISTS,
        HttpStatus.CONFLICT,
        ExceptionLocalCode.PRODUCT_EXISTS,
      );
    }

    const category = await this.categoryRepository.findById(command.name);

    const create = await this.productRepository.create(command);

    await this.historyRepository.create(userId, {
      action: ProductHistoryAction.CREATE,
      entityType: ProductHistoryType.PRODUCT,
      description: `Created product ${command.name} to stock`,
      userId: userId,
      details: { category: category?.name, brand: command.brand },
    });

    return create;
  }

  async findOne(id: string): Promise<ProductResource> {
    const product = await this.productRepository.findByIdOrThrow(id);
    const productInFilial = await this.getFilialByProduct(id);

    return {
      ...product,
      productStore: productInFilial.map((item) => ({
        filialId: item.filial.id,
        filialName: item.filial.name,
        filialAddress: item.filial.address,
        count: item.count,
      })) as ProductStoreResource[],
    };
  }

  getAll(): Promise<ProductResource[]> {
    return this.productRepository.getAll();
  }

  async findProductsByCategory(id: string): Promise<ProductResource[]> {
    return await this.productRepository.findProductsByCategory(id);
  }

  async findByName(query: ProductListQuery): Promise<ProductResource[]> {
    return await this.productRepository.findByLikeName(query);
  }

  async update(
    userId: string,
    id: string,
    command: UpdateProductCommand,
  ): Promise<boolean> {
    const product = await this.productRepository.findByIdOrThrow(id);

    const historyCommand = {
      action: ProductHistoryAction.EDIT,
      entityType: ProductHistoryType.PRODUCT,
      description: `Edited product ${product.name} in stock`,
      userId: userId,
    };

    await this.productRepository.update(id, command);

    await this.historyRepository.create(userId, historyCommand);

    return true;
  }

  async delete(userId: string, id: string): Promise<boolean> {
    const product = await this.productRepository.findByIdOrThrow(id);

    const add = await this.productRepository.delete(id);

    await this.historyRepository.create(userId, {
      action: ProductHistoryAction.DELETE,
      entityType: ProductHistoryType.PRODUCT,
      description: `Deleted product ${product.name} from stock`,
      userId: userId,
      details: {},
    });

    return add;
  }

  async getFilialByProduct(productId: string) {
    return this.filialProductsRepository.getFilialsByProduct(productId);
  }
}
