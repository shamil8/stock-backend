import { HttpStatus, Injectable } from '@nestjs/common';
import { QueryRunnerService } from '@app/database/services/query-runner.service';
import { LoggerService } from '@app/logger/services/logger.service';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { HistoryCommand } from '../dto/command/history.command';
import { HistoryResource } from '../dto/resources/history-resource';
import { HistoryRepository } from '../repositories/history.repository';
import { ProductRepository } from '../repositories/product.repository';

@Injectable()
export class HistoryService {
  constructor(
    private readonly logger: LoggerService,
    private readonly queryRunnerService: QueryRunnerService,
    private readonly repository: HistoryRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  // async createHistory(
  //   userId: string,
  //   command: HistoryCommand,
  // ): Promise<HistoryResource> {
  //   const product = await this.productRepository.findOne(command.productId);
  //
  //   if (!command.diff || product.count + command.diff < 0) {
  //     throw new AppHttpException(
  //       ExceptionMessage.INSUFFICIENT_COUNT,
  //       HttpStatus.BAD_REQUEST,
  //       ExceptionLocalCode.INSUFFICIENT_COUNT,
  //     );
  //   }
  //
  //   const queryRunner = await this.queryRunnerService.create();
  //
  //   try {
  //     await this.productRepository.update(product.id, command, queryRunner);
  //
  //     const history = await this.repository.create(
  //       userId,
  //       command.diff,
  //       product.id,
  //       queryRunner,
  //     );
  //
  //     await this.queryRunnerService.finish(queryRunner);
  //
  //     return history;
  //   } catch (err: any) {
  //     await this.queryRunnerService.rollback(queryRunner);
  //
  //     this.logger.error('Failed to save history with product', {
  //       stack: this.createHistory.name,
  //       extra: `${err}`,
  //     });
  //
  //     throw new AppHttpException(
  //       ExceptionMessage.PRODUCT_HISTORY_NOT_CREATED,
  //       HttpStatus.NOT_ACCEPTABLE,
  //       ExceptionLocalCode.PRODUCT_HISTORY_NOT_CREATED,
  //     );
  //   }
  // }

  async gelAll(): Promise<HistoryResource[]> {
    return this.repository.getAllHistory();
  }
}
