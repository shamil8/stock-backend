import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FilialsController } from './controllers/filials.controller';
import { FilialsEntity } from './entities/filials.entity';
import { FilialsProductsEntity } from './entities/filials-products.entity';
import { FilialRepository } from './repositories/filial.repository';
import { FilialsProductsRepository } from './repositories/filials-products.repository';
import { FilialsService } from './services/filials.service';

@Module({
  imports: [TypeOrmModule.forFeature([FilialsEntity, FilialsProductsEntity])],
  controllers: [FilialsController],
  providers: [FilialRepository, FilialsService, FilialsProductsRepository],
})
export class FilialsModule {}
