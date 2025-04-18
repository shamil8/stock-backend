import { Injectable } from '@nestjs/common';

import { HistoryDto } from '../dto/command/history.dto';
import { HistoryRepository } from '../repositories/history.repository';
@Injectable()
export class HistoryService {
  constructor(private readonly repository: HistoryRepository) {}

  async create(dto: HistoryDto) {
    return this.repository.create(dto);
  }

  async gelAll() {
    return this.repository.getAllHistory();
  }
}
