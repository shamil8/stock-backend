import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { ClientsCommand } from '../dto/command/clients.command';
import { UpdateClientCommand } from '../dto/command/update-client.command';
import { ClientsResource } from '../dto/resources/client.resource';
import { ClientsEntity } from '../entities/clients.entity';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(ClientsEntity)
    private readonly clientsRepository: Repository<ClientsEntity>,
  ) {}

  async findClientByEmail(email: string): Promise<ClientsResource | null> {
    const client = await this.clientsRepository
      .createQueryBuilder('c')
      .where('c.email = :email', { email })
      .getOne();

    return client;
  }

  async findById(id: string): Promise<ClientsResource | null> {
    const client = await this.clientsRepository
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .getOne();

    return client ? client : null;
  }

  async findClientByIdOrThrow(id: string): Promise<ClientsResource> {
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

  async addClient(command: ClientsCommand): Promise<ClientsResource> {
    const client = await this.findClientByEmail(command.email);

    if (client) {
      throw new AppHttpException(
        ExceptionMessage.CLIENT_ALREADY_EXISTS,
        HttpStatus.BAD_REQUEST,
        ExceptionLocalCode.CLIENT_ALREADY_EXISTS,
      );
    }

    const newClient = this.clientsRepository.create(command);

    return await this.clientsRepository.save(newClient);
  }

  async getAllClients(): Promise<ClientsResource[]> {
    return await this.clientsRepository.createQueryBuilder('c').getMany();
  }

  async addDebt(id: string, amount: number, queryRunner?: QueryRunner) {
    await this.clientsRepository
      .createQueryBuilder('c', queryRunner)
      .useTransaction(!!queryRunner)
      .update()
      .set({ currentDebt: () => 'currentDebt + :amount' })
      .where('id = :id', { id })
      .setParameters({ amount: Number(amount) })
      .execute();

    return true;
  }

  async updateClient(
    id: string,
    command: UpdateClientCommand,
  ): Promise<ClientsResource> {
    await this.findClientByIdOrThrow(id);

    await this.clientsRepository
      .createQueryBuilder('c')
      .update()
      .set(command)
      .where('id = :id', { id })
      .execute();

    return await this.findClientByIdOrThrow(id);
  }

  async deleteClientById(id: string): Promise<boolean> {
    await this.findClientByIdOrThrow(id);

    await this.clientsRepository
      .createQueryBuilder('c')
      .delete()
      .where('id = :id', { id })
      .execute();

    return true;
  }

  async updatePurchase(
    id: string,
    type: 'in' | 'out',
    amount: number,
    queryRunner?: QueryRunner,
  ): Promise<ClientsResource> {
    const client = await this.findClientByIdOrThrow(id);

    if (type === 'in') {
      client.totalPurchases += amount;
    } else {
      client.totalPurchases -= amount;
    }

    client.lastPurchase = new Date();

    await this.clientsRepository
      .createQueryBuilder('c', queryRunner)
      .useTransaction(!!queryRunner)
      .update()
      .set(client)
      .where('id = :id', { id })
      .execute();

    return client;
  }
}
