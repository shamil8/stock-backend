import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@app/logger/logger.module';

import { FilialsEntity } from '../filials/entities/filials.entity';
import { FilialsModule } from '../filials/filials.module';
import { FilialRepository } from '../filials/repositories/filial.repository';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [
    LoggerModule,
    TypeOrmModule.forFeature([UserEntity, FilialsEntity]),
  ],
  controllers: [UserController],
  providers: [
    // repositories
    UserRepository,
    FilialRepository,

    // services
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
