import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CategoryDto } from '../dto/command/categoryDto';
import { CategoryService } from '../services/category.service';

@ApiTags('Categories')
@Controller('category')
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post('categories')
  @ApiOperation({
    summary: 'Add a new category.',
  })
  create(@Body() category: CategoryDto): Promise<CategoryDto> {
    return this.service.create(category);
  }

  @ApiOperation({
    summary: 'Find a category.',
  })
  @Get('categoties')
  findAll() {
    return this.service.find();
  }

  @ApiOperation({
    summary: 'Delete a category.',
  })
  @Delete('/:id')
  delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
