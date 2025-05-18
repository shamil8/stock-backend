import { Injectable } from '@nestjs/common';

import { ProductCommand } from '../dto/command/product.command';
import { UpdateProductCommand } from '../dto/command/updateProduct.command';
import { ProductListQuery } from '../dto/query/product-list.query';
import { ProductResource } from '../dto/resources/product.resource';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly ProductRepository: ProductRepository) {}

  async create(data: ProductCommand): Promise<ProductResource> {
    return await this.ProductRepository.create(data);
  }

  async findOne(id: string): Promise<ProductResource> {
    return await this.ProductRepository.findOne(id);
  }

  async findProductsByCategory(id: string): Promise<ProductResource[]> {
    return await this.ProductRepository.findProductsByCategory(id);
  }

  async findAll(name: ProductListQuery): Promise<ProductResource[]> {
    return await this.ProductRepository.findAll(name);
  }

  async update(id: string, productDto: UpdateProductCommand): Promise<boolean> {
    return await this.ProductRepository.update(id, productDto);
  }

  async delete(id: string): Promise<boolean> {
    return await this.ProductRepository.delete(id);
  }
}
