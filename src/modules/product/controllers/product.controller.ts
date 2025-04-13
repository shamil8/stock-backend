import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ProductDto } from '../dto/command/product.dto';
import { ProductService } from '../services/product.service';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post('products')
  @ApiOperation({
    summary: 'Add a new product',
    description: '...',
  })
  create(@Body() createProductDto: ProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get('products')
  @ApiOperation({
    summary: 'Get products',
    description: 'Get a list of all products',
  })
  getAll() {
    return this.productService.findAll();
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a product',
    description: 'Get a product by its id',
  })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Delete a product by its id',
  })
  delete(@Param('id') id: number) {
    return this.productService.delete(id);
  }
}
