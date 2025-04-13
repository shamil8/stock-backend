import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductDto } from '../dto/command/product.dto';
import { ProductDetails } from '../dto/command/productDetails';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(productDto: ProductDto) {
    return await this.productRepository.save(productDto);
  }

  async findOne(id: string): Promise<ProductEntity | null> {
    return this.productRepository.findOne({ where: { id } });
  }

  async findAll(): Promise<ProductDetails[]> {
    const products = await this.productRepository.find();

    return products;
  }

  async delete(id: number) {
    return await this.productRepository.delete(id);
  }
}
