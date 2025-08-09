import { Injectable } from '@nestjs/common';

import { WorkersCommand } from '../dto/command/workers.command';
import { WorkersRepository } from '../repositories/workers.repository';

@Injectable()
export class WorkersService {
  constructor(private readonly workersRepository: WorkersRepository) {}

  addWorker(command: WorkersCommand) {
    return this.workersRepository.add(command);
  }

  getAllWorkers() {
    return this.workersRepository.getAllWorkers();
  }

  deleteWorker(id: string) {
    return this.workersRepository.deleteWorker(id);
  }
}
