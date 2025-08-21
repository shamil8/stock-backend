import { Injectable } from '@nestjs/common';

import { UpdateWorkersCommand } from '../dto/command/update-workers.command';
import { WorkersCommand } from '../dto/command/workers.command';
import { WorkersResource } from '../dto/resource/worker.resource';
import { WorkersRepository } from '../repositories/workers.repository';

@Injectable()
export class WorkersService {
  constructor(private readonly workersRepository: WorkersRepository) {}

  addWorker(command: WorkersCommand): Promise<WorkersResource> {
    return this.workersRepository.add(command);
  }

  getAllWorkers(): Promise<WorkersResource[]> {
    return this.workersRepository.getAllWorkers();
  }

  updateWorker(id: string, command: UpdateWorkersCommand): Promise<boolean> {
    return this.workersRepository.updateWorker(id, command);
  }

  deleteWorker(id: string): Promise<boolean> {
    return this.workersRepository.deleteWorker(id);
  }
}
