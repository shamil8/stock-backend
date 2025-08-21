import { Injectable } from '@nestjs/common';

import { ClientsCommand } from '../dto/command/clients.command';
import { ClientsResource } from '../dto/resources/client.resource';
import { ClientsRepository } from '../repositories/clients.repository';

@Injectable()
export class ClientsService {
  constructor(private readonly clientsService: ClientsRepository) {}

  addClient(command: ClientsCommand): Promise<ClientsResource> {
    return this.clientsService.addClient(command);
  }

  getAllClients(): Promise<ClientsResource[]> {
    return this.clientsService.getAllClients();
  }

  updateClient(
    email: string,
    command: ClientsCommand,
  ): Promise<ClientsResource> {
    return this.clientsService.updateClient(email, command);
  }

  deleteClientById(id: string): Promise<boolean> {
    return this.clientsService.deleteClientById(id);
  }
}
