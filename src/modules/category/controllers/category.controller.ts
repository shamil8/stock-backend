import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CategoryDto } from '../dto/command/categoryDto';
import { UpdateCategoryDto } from '../dto/command/updateCategory.dto';
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
  create(@Body() category: CategoryDto): Promise<CategoryDto> {
    return this.service.create(category);
  }

  @ApiOperation({
    summary: 'Find all categories.',
  })
  @Get()
  findAll() {
    return this.service.find();
  }
  @Put('/:id')
  @ApiOperation({
    summary: 'Update a category',
    description: 'Update a category using its id',
  })
  update(@Param('id') id: string, @Body() categoryDto: UpdateCategoryDto) {
    return this.service.update(id, categoryDto);
  }

  @ApiOperation({
    summary: 'Delete a category.',
    description: 'Delete a category by its id.',
  })
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
