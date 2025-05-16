import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryEntity } from '../../category/entities/category.entity';
import { CategoryRepository } from '../../category/repositories/category.repository';
import { ProductCommand } from '../dto/command/product.command';
import { UpdateProductCommand } from '../dto/command/updateProduct.command';
import { ProductListQuery } from '../dto/query/product-list.query';
import { ProductResource } from '../dto/resources/product.resource';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(CategoryEntity)
    private readonly categoryEntity: Repository<CategoryEntity>,
  ) {}

  async create(productDto: ProductCommand): Promise<ProductResource> {
    const category = await this.categoryEntity
      .createQueryBuilder('c')
      .where('c.id = :id', { id: productDto.categoryId })
      .getOne();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = await this.productRepository.create({
      ...productDto,
      category,
    });

    return await this.productRepository.save(product);
  }

  async findOne(id: string): Promise<ProductResource | null> {
    return this.productRepository
      .createQueryBuilder('p')
      .where('p.id = :id', { id })
      .getOne();
  }

  async findProductsByCategory(id: string) {
    const category = await this.categoryEntity
      .createQueryBuilder('c')
      .where('c.id = :id', { id: id })
      .getOne();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const products = await this.productRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .where('p.categoryId = :categoryId', { categoryId: id })
      .getMany();

    return products;
  }

  async findAll(query: ProductListQuery): Promise<ProductResource[]> {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .where('p.name like :name or p.description like :name', {
        name: `%${query.name}%`,
      })
      .getMany();

    console.log(query);

    return products;
  }

  async update(id: string, productDto: UpdateProductCommand) {
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
