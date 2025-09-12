import { Injectable } from '@nestjs/common';

import { UserService } from '../../users/services/user.service';
import { FilialCommand } from '../dto/command/filial.command';
import { UpdateFilialCommand } from '../dto/command/update-filial.command';
import { FilialRepository } from '../repositories/filial.repository';
import { FilialsProductsRepository } from '../repositories/filials-products.repository';

@Injectable()
export class FilialsService {
  constructor(
    private readonly filialsRepository: FilialRepository,
    private readonly productFilialRepository: FilialsProductsRepository,
    private readonly userService: UserService,
  ) {}

  async addFilial(command: FilialCommand) {
    await this.userService.findById(command.manager);

    return this.filialsRepository.addFilial(command);
  }

  getProductsByFilial(filialId: string) {
    return this.productFilialRepository.getProductsByFilial(filialId);
  }

  getAllFilials() {
    return this.filialsRepository.getAllFilials();
  }

  async updateFilial(id: string, command: UpdateFilialCommand) {
    await this.userService.findById(command.manager as string);

    return this.filialsRepository.updateFilial(id, command);
  }

  delete(id: string): Promise<boolean> {
    return this.filialsRepository.delete(id);
  }
}
