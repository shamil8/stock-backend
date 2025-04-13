import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductDto } from '../dto/command/product.dto';
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
    return this.productRepository
      .createQueryBuilder('p')
      .where('p.id: id', { id })
      .getOne();
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .getMany();

    return products;
  }

  async delete(id: number) {
    return await this.productRepository.delete(id);
  }
}
