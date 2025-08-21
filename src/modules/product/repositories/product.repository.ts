import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { CategoryRepository } from '../../category/repositories/category.repository';
import { ProductCommand } from '../dto/command/product.command';
import { UpdateProductCommand } from '../dto/command/update-product.command';
import { ProductListQuery } from '../dto/query/product-list.query';
import { ProductResource } from '../dto/resources/product.resource';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async create(command: ProductCommand): Promise<ProductResource> {
    const category = await this.categoryRepository.findByIdOrFail(
      command.categoryId,
    );

    const product = this.productRepository.create({ ...command, category });

    return await this.productRepository.save(product);
  }

  async getAll(): Promise<ProductResource[]> {
    return await this.productRepository.createQueryBuilder().getMany();
  }

  async findOne(id: string): Promise<ProductResource> {
    const product = await this.productRepository
      .createQueryBuilder('p')
      .where('p.id = :id', { id })
      .getOne();

    if (product) {
      return product;
    }

    throw new AppHttpException(
      ExceptionMessage.PRODUCT_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ExceptionLocalCode.NOT_FOUND,
    );
  }

  async findProductsByCategory(id: string): Promise<ProductResource[]> {
    await this.categoryRepository.findByIdOrFail(id);

    const products = await this.productRepository
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'category')
      .where('p.categoryId = :categoryId', { categoryId: id })
      .getMany();

    return products;
  }

  async findByName(query: ProductListQuery): Promise<ProductResource[]> {
    const qb = this.productRepository.createQueryBuilder('p');

    if (query.name) {
      qb.where('p.name ILIKE :name', { name: `%${query.name}%` });
    }

    const products = await qb.getMany();

    return products;
  }

  async update(
    id: string,
    command: UpdateProductCommand,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    await this.findOne(id);

    await this.productRepository
      .createQueryBuilder('p', queryRunner)
      .useTransaction(!!queryRunner)
      .update()
      .set(command)
      .where('id = :id', { id })
      .execute();

    return true;
  }

  async delete(id: string, queryRunner?: QueryRunner): Promise<boolean> {
    await this.productRepository
      .createQueryBuilder('c', queryRunner)
      .useTransaction(!!queryRunner)
      .delete()
      .where('id = :id', { id })
      .execute();

    return true;
  }
}
