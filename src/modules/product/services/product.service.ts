import { Injectable } from '@nestjs/common';

import { ProductDto } from '../dto/command/product.dto';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly ProductRepository: ProductRepository) {}

  async create(data: ProductDto) {
    return await this.ProductRepository.create(data);
  }

  async findOne(id: string) {
    return await this.ProductRepository.findOne(id);
  }

  async findAll() {
    return await this.ProductRepository.findAll();
  }

  async delete(id: number) {
    return await this.ProductRepository.delete(id);
  }
}
