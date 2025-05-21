import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IdParamDto } from '@app/crypto-utils/dto/params/id-param.dto';
import { QueryRunner, Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { CategoryCommand } from '../dto/command/category.command';
import { UpdateCategoryCommand } from '../dto/command/update-category.command';
import { CategoryResource } from '../dto/resource/category.resource';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}
  async create(command: CategoryCommand): Promise<CategoryResource> {
    const existCategory = await this.categoryRepository
      .createQueryBuilder('c')
      .where('c.name = :name', { name: command.name })
      .getOne();

    if (existCategory) {
      throw new AppHttpException(
        ExceptionMessage.CATEGORY_NOT_FOUND,
        HttpStatus.NOT_FOUND,
        ExceptionLocalCode.CATEGORY_NOT_FOUND,
      );
    }

    const category = new CategoryEntity();

    category.name = command.name;
    category.description = command.description;

    if (command.parentId) {
      const parent = await this.categoryRepository
        .createQueryBuilder('c')
        .where('c.id = :id', { id: command.parentId })
        .getOne();

      if (!parent) {
        throw new AppHttpException(
          ExceptionMessage.PARENT_ID_NOT_FOUND,
          HttpStatus.NOT_FOUND,
          ExceptionLocalCode.PARENT_ID_NOT_FOUND,
        );
      }

      category.parent = parent;
    }

    const entity = await this.categoryRepository.save(category);

    return new CategoryResource(entity);
  }

  async findById(id: string): Promise<CategoryEntity> {
    const category = await this.categoryRepository
      .createQueryBuilder('c')
      .where('c.id = :id', { id })
      .getOne();

    if (category) {
      return category;
    }

    throw new AppHttpException(
      ExceptionMessage.CATEGORY_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ExceptionLocalCode.CATEGORY_NOT_FOUND,
    );
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

  async update(
    id: IdParamDto,
    command: UpdateCategoryCommand,
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    await this.categoryRepository
      .createQueryBuilder('c', queryRunner)
      .useTransaction(!!queryRunner)
      .update()
      .set(command)
      .where('id = :id', { id })
      .execute();

    return true;
  }

  async delete(id: IdParamDto, queryRunner?: QueryRunner): Promise<boolean> {
    await this.categoryRepository
      .createQueryBuilder('c', queryRunner)
      .useTransaction(!!queryRunner)
      .delete()
      .where('id = :id', { id })
      .execute();

    return true;
  }
}
