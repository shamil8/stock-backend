import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { FilialCommand } from '../dto/command/filial.command';
import { UpdateFilialCommand } from '../dto/command/update-filial.command';
import { FilialsEntity } from '../entities/filials.entity';

@Injectable()
export class FilialRepository {
  constructor(
    @InjectRepository(FilialsEntity)
    private readonly filialsRepository: Repository<FilialsEntity>,
  ) {}

  async addFilial(command: FilialCommand) {
    const exists = await this.filialsRepository
      .createQueryBuilder('f')
      .where('f.name = :name', { name: command.name })
      .getOne();

    if (exists) {
      throw new AppHttpException(
        ExceptionMessage.FILIAL_ALREADY_EXISTS,
        HttpStatus.CONFLICT,
        ExceptionLocalCode.FILIAL_ALREADY_EXISTS,
      );
    }

    const filial = this.filialsRepository.create({ ...command });

    return await this.filialsRepository.save(filial);
  }

  getAllFilials() {
    return this.filialsRepository.createQueryBuilder().getMany();
  }

  async getBiIdOrThrow(id: string) {
    const filial = await this.filialsRepository
      .createQueryBuilder('f')
      .where('f.id = :id', { id })
      .getOne();

    if (filial) {
      return filial;
    }

    throw new AppHttpException(
      ExceptionMessage.FILIAL_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ExceptionLocalCode.FILIAL_NOT_FOUND,
    );
  }

  async getBYName(name: string) {
    return await this.filialsRepository
      .createQueryBuilder('f')
      .where('f.name = :name', { name })
      .getOne();
  }

  async updateFilial(id: string, command: UpdateFilialCommand) {
    await this.getBiIdOrThrow(id);

    await this.filialsRepository
      .createQueryBuilder('f')
      .update()
      .set({ ...command })
      .where('f.id = :id', { id })
      .execute();

    return command;
  }
}
