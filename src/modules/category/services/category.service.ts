import { Injectable } from '@nestjs/common';

import { CategoryDto } from '../dto/command/categoryDto';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly Repository: CategoryRepository) {}

  async create(name: CategoryDto) {
    return this.Repository.create(name);
  }

  async find() {
    return this.Repository.findAll();
  }

  async delete(id: string): Promise<boolean> {
    return this.Repository.delete(id);
  }
}
