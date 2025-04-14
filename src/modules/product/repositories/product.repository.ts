import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductDto } from '../dto/command/product.dto';
import { UpdateProductDto } from '../dto/command/updateProduct.dto';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  async create(productDto: ProductDto) {
    const product = await this.productRepository.create(productDto);

    return await this.productRepository.save(product);
  }

  async findOne(id: string): Promise<ProductEntity | null> {
    return this.productRepository
      .createQueryBuilder('p')
      .where('p.id = :id', { id })
      .getOne();
  }

  async findAll(): Promise<ProductEntity[]> {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .getMany();

    return products;
  }

  async update(id: string, productDto: UpdateProductDto) {
    const product = await this.productRepository
      .createQueryBuilder('p')
      .where('p.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return await this.productRepository.update(id, productDto);
  }

  async delete(id: string) {
    const product = await this.productRepository
      .createQueryBuilder('p')
      .where('p.id = :id', { id })
      .getOneOrFail();

    return await this.productRepository.delete(product.id);
  }
}
