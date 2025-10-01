import { Injectable } from '@nestjs/common';

import { BorrowsRepository } from '../repositories/borrows.repository';

@Injectable()
export class BorrowService {
  constructor(private readonly borrowsRepository: BorrowsRepository) {}

  getAll() {
    return this.borrowsRepository.getAll();
  }
}
