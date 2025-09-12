import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from '../users/repositories/user.repository';
import { UserModule } from '../users/user.module';
import { WorkersController } from './controllers/workers.controller';
import { WorkersAttendanceController } from './controllers/workers-attendance.controller';
import { WorkersEntity } from './entities/workers.entity';
import { WorkersAttendanceEntity } from './entities/workers-attendance.entity';
import { WorkersRepository } from './repositories/workers.repository';
import { WorkersAttendanceRepository } from './repositories/workers-attendance.repository';
import { WorkersService } from './services/workers.service';
import { WorkersAttendanceService } from './services/workers-attendance.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkersEntity, WorkersAttendanceEntity]),
    UserModule,
  ],
  controllers: [WorkersController, WorkersAttendanceController],
  providers: [
    WorkersService,
    WorkersRepository,
    WorkersAttendanceRepository,
    WorkersAttendanceService,
  ],
  exports: [WorkersService],
})
export class WorkersModule {}
