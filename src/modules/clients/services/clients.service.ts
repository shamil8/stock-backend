import { Injectable } from '@nestjs/common';

import { ClientsCommand } from '../dto/command/clients.command';
import { ClientsEntity } from '../entities/clients.entity';
import { ClientsRepository } from '../repositories/clients.repository';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsService: ClientsRepository) {}

  addClient(command: ClientsCommand) {
    return this.clientsService.addClient(command);
  }

  getAllClients(): Promise<ClientsEntity[]> {
    return this.clientsService.getAllClients();
  }

  updateClient(email: string, command: ClientsCommand) {
    return this.clientsService.updateClient(email, command);
  }

  deleteClientById(id: string) {
    return this.clientsService.deleteClientById(id);
  }
}
