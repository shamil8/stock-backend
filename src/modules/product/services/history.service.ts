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

  async gelAll(): Promise<HistoryResource[]> {
    return this.repository.getAllHistory();
  }
}
