import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { UserService } from '../../users/services/user.service';
import { UpdateWorkersCommand } from '../dto/command/update-workers.command';
import { WorkersCommand } from '../dto/command/workers.command';
import { WorkersResource } from '../dto/resource/worker.resource';
import { WorkersEntity } from '../entities/workers.entity';

@Injectable()
export class WorkersRepository {
  constructor(
    @InjectRepository(WorkersEntity)
    private readonly workersRepository: Repository<WorkersEntity>,
    private readonly userService: UserService,
  ) {}

  toWorkerResource(entity: WorkersEntity) {
    return {
      accountId: entity.accountId,
      firstName: entity.account?.firstName ?? '',
      lastName: entity.account?.lastName ?? '',
      email: entity.account?.email ?? '',
      phone: entity.phone,
      address: entity.address,
      department: entity.account?.department ?? '',
      position: entity.position,
      role: entity.account?.role,
      salary: entity.salary,
      commission: entity.commission,
      status: entity.status,
      manager: entity.manager,
      skills: entity.skills,
      notes: entity.notes,
      salesTarget: entity.salesTarget,
    };
  }

  async getWorkerByIdOrThrow(id: string): Promise<WorkersResource> {
    const worker = await this.workersRepository
      .createQueryBuilder('w')
      .leftJoinAndSelect('w.account', 'ac')
      .where('w.id = :id', { id })
      .getOne();

    if (!worker) {
      throw new AppHttpException(
        ExceptionMessage.WORKER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        ExceptionLocalCode.WORKER_NOT_FOUND,
      );
    }

    return this.toWorkerResource(worker);
  }

  async findByAccountIdOrThrow(id: string): Promise<WorkersResource> {
    const worker = await this.workersRepository
      .createQueryBuilder('w')
      .leftJoin('w.account', 'ac')
      .select(['w.id'])
      .where('ac.id = :id', { id })
      .getOne();

    if (!worker) {
      throw new AppHttpException(
        ExceptionMessage.WORKER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        ExceptionLocalCode.WORKER_NOT_FOUND,
      );
    }

    return this.toWorkerResource(worker);
  }

  async add(command: WorkersCommand): Promise<boolean> {
    const account = await this.userService.findUserById(command.accountId);

    if (!account) {
      throw new AppHttpException(
        ExceptionMessage.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        ExceptionLocalCode.USER_NOT_FOUND,
      );
    }

    const saveWorker = this.workersRepository.create({
      ...command,
    });

    await this.workersRepository.save(saveWorker);

    return true;
  }

  async getAllWorkers(): Promise<WorkersResource[]> {
    const workers = await this.workersRepository
      .createQueryBuilder('w')
      .getMany();

    return workers.map((w) => this.toWorkerResource(w));
  }

  async updateWorker(
    id: string,
    command: UpdateWorkersCommand,
  ): Promise<boolean> {
    await this.getWorkerByIdOrThrow(id);

    await this.workersRepository
      .createQueryBuilder('w')
      .update()
      .set(command)
      .where('id = :id', { id })
      .execute();

    return true;
  }

  async deleteWorker(id: string): Promise<boolean> {
    await this.getWorkerByIdOrThrow(id);

    await this.workersRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return true;
  }
}
