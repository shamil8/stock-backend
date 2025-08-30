import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ClientsCommand } from '../dto/command/clients.command';
import { ClientsService } from '../services/clients.service';
@ApiTags('Clients')
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @ApiOperation({
    summary: 'Add a new client',
    description: 'Add a new client',
  })
  @ApiOkResponse({ description: 'Successfully created.' })
  addClient(@Body() command: ClientsCommand) {
    return this.clientsService.addClient(command);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all clients',
    description: 'Get all clients',
  })
  getAllClients() {
    return this.clientsService.getAllClients();
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update client',
    description: 'Update an existing client',
  })
  @ApiOkResponse({ description: 'Successfully updated.' })
  updateClient(@Param('id') id: string, @Body() command: ClientsCommand) {
    return this.clientsService.updateClient(id, command);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete client',
    description: 'Delete an existing client by id',
  })
  deleteClientById(@Param('id') id: string) {
    return this.clientsService.deleteClientById(id);
  }
}
