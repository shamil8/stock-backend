import { Injectable } from '@nestjs/common';

import { CategoryCommand } from '../dto/command/category.command';
import { UpdateCategoryDto } from '../dto/command/updateCategory.dto';
import { CategoryResource } from '../dto/resource/category.resource';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly Repository: CategoryRepository) {}

  async create(name: CategoryCommand) {
    return this.Repository.create(name);
  }

  async find(): Promise<CategoryResource[]> {
    return this.Repository.findAll();
  }

  async update(id: string, categoryDto: UpdateCategoryDto) {
    return await this.Repository.update(id, categoryDto);
  }

  async delete(id: string): Promise<boolean> {
    return this.Repository.delete(id);
  }
}
