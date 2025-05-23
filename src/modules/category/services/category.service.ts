import { HttpStatus, Injectable } from '@nestjs/common';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { CategoryCommand } from '../dto/command/category.command';
import { UpdateCategoryCommand } from '../dto/command/update-category.command';
import { CategoryResource } from '../dto/resource/category.resource';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async create(command: CategoryCommand): Promise<CategoryResource> {
    const existCategory = await this.repository.findByName(command.name);

    if (existCategory) {
      throw new AppHttpException(
        ExceptionMessage.CATEGORY_EXISTS,
        HttpStatus.CONFLICT,
        ExceptionLocalCode.CATEGORY_EXISTS,
      );
    }

    return this.repository.create(command);
  }

  async find(): Promise<CategoryResource[]> {
    return this.repository.findAll();
  }

  async update(id: string, command: UpdateCategoryCommand): Promise<boolean> {
    return await this.repository.update(id, command);
  }

  async delete(id: string): Promise<boolean> {
    await this.repository.findByIdOrFail(id);

    return this.repository.delete(id);
  }
}
