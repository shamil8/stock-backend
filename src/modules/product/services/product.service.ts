import { Injectable } from '@nestjs/common';

import { FilialsProductsRepository } from '../../filials/repositories/filials-products.repository';
import { ProductCommand } from '../dto/command/product.command';
import { UpdateProductCommand } from '../dto/command/update-product.command';
import { ProductListQuery } from '../dto/query/product-list.query';
import { ProductResource } from '../dto/resources/product.resource';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly filialsProductsRepository: FilialsProductsRepository,
  ) {}

  async create(data: ProductCommand): Promise<ProductResource> {
    return await this.productRepository.create(data);
  }

  async findOne(id: string): Promise<ProductResource> {
    return await this.productRepository.findOne(id);
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

  async update(id: string, productDto: UpdateProductCommand): Promise<boolean> {
    return await this.productRepository.update(id, productDto);
  }

  async delete(id: string): Promise<boolean> {
    return await this.productRepository.delete(id);
  }

  async getFilialByProduct(productId: string) {
    console.log('rpodudufdhfa', productId);

    return this.filialsProductsRepository.getFilialByProduct(productId);
  }
}
