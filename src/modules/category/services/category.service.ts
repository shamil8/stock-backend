import { Injectable } from '@nestjs/common';

import { UpdateProductDto } from '../../product/dto/command/updateProduct.dto';
import { CategoryDto } from '../dto/command/categoryDto';
import { UpdateCategoryDto } from '../dto/command/updateCategory.dto';
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

  async update(id: string, categoryDto: UpdateCategoryDto) {
    return await this.Repository.update(id, categoryDto);
  }

  async delete(id: string): Promise<boolean> {
    return this.Repository.delete(id);
  }
}
