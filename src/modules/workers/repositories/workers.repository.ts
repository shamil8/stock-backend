import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { WorkersCommand } from '../dto/command/workers.command';
import { WorkersEntity } from '../entities/workers.entity';

@Injectable()
export class WorkersRepository {
  constructor(
    @InjectRepository(WorkersEntity)
    private readonly workersRepository: Repository<WorkersEntity>,
  ) {}

  async findByEmail(email: string): Promise<WorkersEntity | null> {
    return await this.workersRepository
      .createQueryBuilder('w')
      .where('w.email = :email', { email })
      .getOne();
  }

  async getWorkerByIdOrThrow(id: string) {
    const worker = await this.workersRepository
      .createQueryBuilder('w')
      .where('w.id = :id', { id })
      .getOne();

    if (!worker) {
      throw new AppHttpException(
        ExceptionMessage.WORKER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        ExceptionLocalCode.WORKER_NOT_FOUND,
      );
    }

    return worker;
  }

  async add(command: WorkersCommand) {
    const worker = await this.findByEmail(command.email);

    if (worker) {
      throw new AppHttpException(
        ExceptionMessage.WORKER_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
        ExceptionLocalCode.WORKER_ALREADY_EXISTS,
      );
    }

    const saveWorker = this.workersRepository.create(command);

    await this.workersRepository.save(saveWorker);

    return await this.findByEmail(command.email);
  }

  async getAllWorkers() {
    return await this.workersRepository.createQueryBuilder('w').getMany();
  }

  async deleteWorker(id: string) {
    await this.getWorkerByIdOrThrow(id);

    await this.workersRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    return true;
  }
}
