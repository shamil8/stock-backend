import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientsController } from './controllers/clients.controller';
import { ClientsEntity } from './entities/clients.entity';
import { ClientsRepository } from './repositories/clients.repository';
import { ClientsService } from './services/clients.service';

@Module({
  imports: [TypeOrmModule.forFeature([ClientsEntity])],
  providers: [ClientsService, ClientsRepository],
  controllers: [ClientsController],
  exports: [ClientsService, ClientsRepository],
})
export class ClientsModule {}
