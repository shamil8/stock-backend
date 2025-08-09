import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { ClientsCommand } from '../dto/command/clients.command';
import { UpdateClientCommand } from '../dto/command/update-client.command';
import { ClientsEntity } from '../entities/clients.entity';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(ClientsEntity)
    private readonly clientsRepository: Repository<ClientsEntity>,
  ) {}

  async findClientByEmail(email: string): Promise<ClientsEntity | null> {
    const client = await this.clientsRepository
      .createQueryBuilder('c')
      .where('c.email = :email', { email })
      .getOne();

    return client;
  }

  async findClientByIdOrThrow(id: string): Promise<ClientsEntity> {
    const client = await this.clientsRepository
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .getOne();

    if (!client) {
      throw new AppHttpException(
        ExceptionMessage.CLIENT_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        ExceptionLocalCode.CLIENT_NOT_FOUND,
      );
    }

    return client;
  }

  async addClient(command: ClientsCommand) {
    const client = await this.findClientByEmail(command.email);

    if (client) {
      throw new AppHttpException(
        ExceptionMessage.CLIENT_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
        ExceptionLocalCode.CLIENT_ALREADY_EXISTS,
      );
    }

    const newClient = this.clientsRepository.create(command);

    await this.clientsRepository.save(newClient);

    return newClient;
  }

  async getAllClients(): Promise<ClientsEntity[]> {
    return await this.clientsRepository.createQueryBuilder('c').getMany();
  }

  async updateClient(id: string, command: UpdateClientCommand) {
    await this.findClientByIdOrThrow(id);

    await this.clientsRepository
      .createQueryBuilder('c')
      .update()
      .set(command)
      .where('id = :id', { id })
      .execute();

    return await this.findClientByIdOrThrow(id);
  }

  async deleteClientById(id: string) {
    await this.findClientByIdOrThrow(id);

    await this.clientsRepository
      .createQueryBuilder('c')
      .delete()
      .where('id = :id', { id })
      .execute();

    return true;
  }
}
