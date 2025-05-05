import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { HistoryDto } from '../dto/command/history.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductHistoryEntity } from '../entities/productHistory.entity';

@Injectable()
export class HistoryRepository {
  constructor(
    @InjectRepository(ProductHistoryEntity)
    private readonly historyRepository: Repository<ProductHistoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}
  async create(dto: HistoryDto): Promise<ProductHistoryEntity> {
    const product = await this.productRepo
      .createQueryBuilder('p')
      .where('p.id = :id', { id: dto.productid })
      .getOne();

    if (!product) {
      throw new Error('Product not found');
    }

    const diff = dto.diff;

    if (diff !== 0) {
      if (product.count + diff < 0) {
        throw new BadRequestException('Insufficient product count');
      }

      const description =
        diff > 0
          ? `Added ${diff} units to the product count`
          : `Reduced ${Math.abs(diff)} units from the product count`;

      const history = this.historyRepository.create({
        diff: diff,
        description: description,
        userId: dto.targetId,
        product: product,
      });

      await this.historyRepository.save(history);

      product.count += diff;
      await this.productRepo.save(product);

      return history;
    } else {
      throw new BadRequestException('Invalid diff value');
    }
  }

  async getAllHistory(): Promise<ProductHistoryEntity[]> {
    return await this.historyRepository
      .createQueryBuilder('product_histories')
      .getMany();
  }
}
