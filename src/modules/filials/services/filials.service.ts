import { Injectable } from '@nestjs/common';

import { FilialCommand } from '../dto/command/filial.command';
import { UpdateFilialCommand } from '../dto/command/update-filial.command';
import { FilialRepository } from '../repositories/filial.repository';
import { FilialsProductsRepository } from '../repositories/filials-products.repository';

@Injectable()
export class FilialsService {
  constructor(
    private readonly filialsRepository: FilialRepository,
    private readonly productFilialRepository: FilialsProductsRepository,
  ) {}

  addFilial(command: FilialCommand) {
    return this.filialsRepository.addFilial(command);
  }

  getProductsByFilial(filialId: string) {
    return this.productFilialRepository.getProductsByFilial(filialId);
  }

  getAllFilials() {
    return this.filialsRepository.getAllFilials();
  }

  updateFilial(id: string, command: UpdateFilialCommand) {
    return this.filialsRepository.updateFilial(id, command);
  }
}
