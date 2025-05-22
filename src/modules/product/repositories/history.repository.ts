import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { HistoryCommand } from '../dto/command/history.command';
import { HistoryResource } from '../dto/resources/history-resource';
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
  async create(dto: HistoryCommand): Promise<HistoryResource> {
    const product = await this.productRepo
      .createQueryBuilder('p')
      .where('p.id = :id', { id: dto.productId })
      .getOne();

    if (!product) {
      throw new AppHttpException(
        ExceptionMessage.PRODUCT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        ExceptionLocalCode.PRODUCT_NOT_FOUND,
      );
    }

    const diff = dto.diff;

    if (diff !== 0) {
      if (product.count + diff < 0) {
        throw new AppHttpException(
          ExceptionMessage.INSUFFICIENT_COUNT,
          HttpStatus.BAD_REQUEST,
          ExceptionLocalCode.INSUFFICIENT_COUNT,
        );
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
      throw new AppHttpException(
        ExceptionMessage.INVALID_DIFF_VALUE,
        HttpStatus.BAD_REQUEST,
        ExceptionLocalCode.INVALID_DIFF_VALUE,
      );
    }
  }

  async getAllHistory(): Promise<ProductHistoryEntity[]> {
    return await this.historyRepository
      .createQueryBuilder('product_histories')
      .getMany();
  }
}
