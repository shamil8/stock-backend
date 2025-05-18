import { Injectable } from '@nestjs/common';

import { CategoryCommand } from '../dto/command/category.command';
import { UpdateCategoryCommand } from '../dto/command/update-category.command';
import { CategoryResource } from '../dto/resource/category.resource';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly repository: CategoryRepository) {}

  async create(command: CategoryCommand): Promise<CategoryResource> {
    return this.repository.create(command);
  }

  async find(): Promise<CategoryResource[]> {
    return this.repository.findAll();
  }

  async update(id: string, command: UpdateCategoryCommand): Promise<boolean> {
    const category = await this.repository.findById(id);

    return await this.repository.update(category.id, command);
  }

  async delete(id: string): Promise<boolean> {
    const category = await this.repository.findById(id);

    return this.repository.delete(category.id);
  }
}
