import { Injectable } from '@nestjs/common';

import { HistoryCommand } from '../dto/command/history.command';
import { HistoryRepository } from '../repositories/history.repository';
@Injectable()
export class HistoryService {
  constructor(private readonly repository: HistoryRepository) {}

  async create(dto: HistoryCommand) {
    return this.repository.create(dto);
  }

  async gelAll() {
    return this.repository.getAllHistory();
  }
}
