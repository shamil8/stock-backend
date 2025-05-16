import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RequestInterface } from '../../auth/interfaces/request.interface';
import { ProductCommand } from '../dto/command/product.command';
import { UpdateProductCommand } from '../dto/command/updateProduct.command';
import { ProductListQuery } from '../dto/query/product-list.query';
import { ProductResource } from '../dto/resources/product.resource';
import { ProductService } from '../services/product.service';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @ApiOperation({
    summary: 'Add a new product',
    description: 'Add a new product',
  })
  create(@Body() createProductDto: ProductCommand): Promise<ProductResource> {
    return this.productService.create(createProductDto);
  }

  @Get('/categories/:id')
  @ApiOperation({
    summary: 'Find all products by their category',
    description: 'Get a list of products by their category',
  })
  @ApiOkResponse({
    type: ProductResource,
    description: 'Got a list of products by their category',
  })
  findProductsByCategory(@Param('id') id: string): Promise<ProductResource[]> {
    return this.productService.findProductsByCategory(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products by their name.',
    description: 'Get a list of all products by their name.',
  })
  @ApiOkResponse({
    type: ProductResource,
    description: 'Got a list of all products by their name.',
  })
  @ApiResponse({})
  getAll(@Query() name: ProductListQuery): Promise<ProductResource[]> {
    return this.productService.findAll(name);
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'Get a product',
    description: 'Get a product by its id',
  })
  findOne(@Param('id') id: string): Promise<ProductResource | null> {
    return this.productService.findOne(id);
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update a product using its id',
  })
  update(
    @Param('id') id: string,
    @Body() productDto: UpdateProductCommand,
  ): Promise<UpdateResult> {
    return this.productService.update(id, productDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Delete a product by its id',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  delete(
    @Request() { user }: RequestInterface,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    console.log('Saloommmmmmm', user);

    return this.productService.delete(id);
  }
}
