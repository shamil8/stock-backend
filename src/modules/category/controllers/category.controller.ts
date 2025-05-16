import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CategoryCommand } from '../dto/command/category.command';
import { UpdateCategoryDto } from '../dto/command/updateCategory.dto';
import { CategoryResource } from '../dto/resource/category.resource';
import { CategoryService } from '../services/category.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  @ApiOperation({
    summary: 'Add a new category.',
    description: 'Add a new category.',
  })
  create(@Body() category: CategoryCommand): Promise<CategoryResource> {
    return this.service.create(category) as any;
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories.',
    description: 'This route will return a list of categories with children',
  })
  @ApiOkResponse({
    type: CategoryResource,
    isArray: true,
    description: 'Got all categories',
  })
  findAll(): Promise<CategoryResource[]> {
    return this.service.find();
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a category',
    description: 'Update a category using its id',
  })
  update(
    @Param('id') id: string,
    @Body() categoryDto: UpdateCategoryDto,
  ): Promise<object> {
    return this.service.update(id, categoryDto);
  }

  @ApiOperation({
    summary: 'Delete a category.',
    description: 'Delete a category by its id.',
  })
  @Delete('/:id')
  delete(@Param('id') id: string): Promise<boolean> {
    return this.service.delete(id);
  }
}
