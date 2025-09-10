import { Injectable } from '@nestjs/common';
import { use } from 'passport';
import { first } from 'rxjs';

import { UserService } from '../../users/services/user.service';
import { UpdateWorkersCommand } from '../dto/command/update-workers.command';
import { WorkersCommand } from '../dto/command/workers.command';
import { WorkersResource } from '../dto/resource/worker.resource';
import { WorkersRepository } from '../repositories/workers.repository';

@Injectable()
export class WorkersService {
  constructor(
    private readonly workersRepository: WorkersRepository,
    private readonly userService: UserService,
  ) {}

  addWorker(command: WorkersCommand): Promise<boolean> {
    return this.workersRepository.add(command);
  }

  async getAllWorkers() {
    const workers = await this.workersRepository.getAllWorkers();
    const result = [];

    for (const worker of workers) {
      const user = await this.userService.findById(worker.accountId);

      result.push({
        ...worker,
        firstName: user?.firstName ?? null,
        lastName: user?.lastName ?? null,
        role: user?.role ?? null,
        department: user?.department ?? null,
        avatar: user.avatar,
        filialId: user.filialsId,
      });
    }

    return result;
  }

  updateWorker(
    id: string,
    command: UpdateWorkersCommand,
  ): Promise<WorkersResource> {
    return this.workersRepository.updateWorker(id, command);
  }

  deleteWorker(id: string): Promise<boolean> {
    return this.workersRepository.deleteWorker(id);
  }
}
