import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CategoryCommand } from '../dto/command/category.command';
import { UpdateCategoryDto } from '../dto/command/updateCategory.dto';
import { CategoryResource } from '../dto/resource/category.resource';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  async create(categoryDto: CategoryCommand): Promise<object> {
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
      const parent = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.id = :id', { id: categoryDto.parentId })
        .getOne();

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

  async findAll(): Promise<CategoryResource[]> {
    const catigories = await this.categoryRepository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.children', 'children')
      .select([
        'c.id',
        'c.name',
        'c.description',
        'c.parentId',
        'children.id',
        'children.name',
        'children.description',
        'children.parentId',
      ])
      .getMany();

    return catigories;
  }

  async update(id: string, categoryDto: UpdateCategoryDto): Promise<object> {
    const product = await this.categoryRepository
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return await this.categoryRepository.update(id, categoryDto as any);
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
