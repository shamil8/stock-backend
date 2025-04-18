import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RequestInterface } from '../../auth/interfaces/request.interface';
import { HistoryDto } from '../dto/command/history.dto';
import { ProductDto } from '../dto/command/product.dto';
import { UpdateProductDto } from '../dto/command/updateProduct.dto';
import { HistoryService } from '../services/history.service';
import { ProductService } from '../services/product.service';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly historyService: HistoryService,
  ) {}
  @Post()
  @ApiOperation({
    summary: 'Add a new product',
    description: 'Add a new product',
  })
  create(@Body() createProductDto: ProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products.',
    description: 'Get a list of all products.',
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

  @Put('/:id')
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update a product using its id',
  })
  update(@Param('id') id: string, @Body() productDto: UpdateProductDto) {
    return this.productService.update(id, productDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Delete a product by its id',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  delete(@Request() { user }: RequestInterface, @Param('id') id: string) {
    console.log('Saloommmmmmm', user);

    return this.productService.delete(id);
  }
}
