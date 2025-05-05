import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryDto } from '../dto/command/categoryDto';
import { UpdateCategoryDto } from '../dto/command/updateCategory.dto';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  async create(categoryDto: CategoryDto) {
    const existCategory = await this.categoryRepository.findOne({
      where: { name: categoryDto.name },
    });

    if (existCategory) {
      throw new ConflictException('A category with this name already exists.');
    }

    const category = new CategoryEntity();

    category.name = categoryDto.name;
    category.description = categoryDto.description;

    if (categoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: categoryDto.parentId },
      });

      if (!parent) {
        throw new NotFoundException('Parent category not found.');
      }

      category.parent = parent;
    }

    await this.categoryRepository.save(category);

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      parentId: category.parent?.id ?? null,
    };
  }
  async findAll() {
    const catigories = await this.categoryRepository
      .createQueryBuilder('c')
      .getMany();

    return catigories;
  }

  async update(id: string, categoryDto: UpdateCategoryDto) {
    const product = await this.categoryRepository
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return await this.categoryRepository.update(id, categoryDto);
  }

  async delete(id: string): Promise<boolean> {
    const category = await this.categoryRepository
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .getOne();

    if (!category) {
      throw new NotFoundException(`Category with Id: ${id} not found`);
    }

    await this.categoryRepository.delete(category.id);

    return true;
  }
}
