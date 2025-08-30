import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { FilialsProductsEntity } from '../entities/filials-products.entity';

@Injectable()
export class FilialsProductsRepository {
  constructor(
    @InjectRepository(FilialsProductsEntity)
    private readonly filialsProductsRepository: Repository<FilialsProductsEntity>,
  ) {}

  add(filialId: string, productId: string, count: number) {
    const inc = this.filialsProductsRepository.create({
      filialId,
      productId,
      count,
    });

    return this.filialsProductsRepository.save(inc);
  }

  async findAll() {
    return await this.filialsProductsRepository
      .createQueryBuilder('fp')
      .leftJoinAndSelect('fp.product', 'product')
      .leftJoinAndSelect('fp.filial', 'filial')
      .getMany();
  }

  async findOne(filialId: string, productId: string) {
    const inc = await this.filialsProductsRepository
      .createQueryBuilder('s')
      .where('s.filialId = :filialId', { filialId })
      .andWhere('s.productId = :productId', { productId })
      .getOne();

    return inc;
  }

  async update(
    filialId: string,
    productId: string,
    count: number,
    type: 'in' | 'out',
    queryRunner?: QueryRunner,
  ) {
    const inc = await this.findOne(filialId, productId);

    const setCount = type === 'in' ? '+' : '-';

    if (inc) {
      return await this.filialsProductsRepository
        .createQueryBuilder('c', queryRunner)
        .useTransaction(!!queryRunner)
        .update(FilialsProductsEntity)
        .set({ count: () => `"count" ${setCount} ${count}` })
        .where('filial_id = :filialId', { filialId })
        .andWhere('product_id = :productId', { productId })
        .returning('*')
        .execute();
    }

    return await this.add(filialId, productId, count);
  }

  async getProductsByFilial(filialId: string) {
    const products = await this.filialsProductsRepository
      .createQueryBuilder('fp')
      .leftJoinAndSelect('fp.product', 'p')
      .select(['fp.id', 'fp.count', 'p.id', 'p.name', 'p.location', 'p.sku'])
      .where('fp.filialId = :filialId', { filialId })
      .getMany();

    return products;
  }

  async getFilialByProduct(productId: string) {
    const filials = await this.filialsProductsRepository
      .createQueryBuilder('fp')
      .leftJoinAndSelect('fp.filial', 'f')
      .select(['fp.id', 'fp.count', 'f.id', 'f.name'])
      .where('fp.productId = :productId', { productId })
      .getMany();

    return filials;
  }
}
