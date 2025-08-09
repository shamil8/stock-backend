import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkersController } from './controllers/workers.controller';
import { WorkersEntity } from './entities/workers.entity';
import { WorkersRepository } from './repositories/workers.repository';
import { WorkersService } from './services/workers.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkersEntity])],
  controllers: [WorkersController],
  providers: [WorkersService, WorkersRepository],
})
export class WorkersModule {}
