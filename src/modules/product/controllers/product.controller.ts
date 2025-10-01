import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
  ApiTags,
} from '@nestjs/swagger';
import { IdParamDto } from '@app/crypto-utils/dto/params/id-param.dto';

import { ApiAppException } from '../../../dto/resource/app-exception.resource';
import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RequestInterface } from '../../auth/interfaces/request.interface';
import { ProductCommand } from '../dto/command/product.command';
import { UpdateProductCommand } from '../dto/command/update-product.command';
import { ProductListQuery } from '../dto/query/product-list.query';
import { ProductResource } from '../dto/resources/product.resource';
import { ProductService } from '../services/product.service';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Post()
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add a new product',
    description: 'Add a new product',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'Got new product',
  })
  @ApiAppException({
    statusCode: HttpStatus.CONFLICT,
    description: ExceptionMessage.CATEGORY_EXISTS,
    localCode: ExceptionLocalCode.CATEGORY_EXISTS,
  })
  create(
    @Request() { user }: RequestInterface,
    @Body() createProductDto: ProductCommand,
  ): Promise<ProductResource> {
    console.log('ccc', createProductDto);

    return this.productService.create(user.id, createProductDto);
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
  findProductsByCategory(
    @Param() { id }: IdParamDto,
  ): Promise<ProductResource[]> {
    return this.productService.findProductsByCategory(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Get a list of products',
  })
  @ApiOkResponse({
    type: ProductResource,
    description: 'Got a list of products',
  })
  getAll(): Promise<ProductResource[]> {
    return this.productService.getAll();
  }

  @Get('name/:name')
  @ApiOperation({
    summary: 'Get all products by their name.',
    description: 'Get a list of all products by their name.',
  })
  @ApiOkResponse({
    type: ProductResource,
    description: 'Got a list of all products by their name.',
  })
  getByName(@Query() query: ProductListQuery): Promise<ProductResource[]> {
    return this.productService.findByName(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a product',
    description: 'Get a product by its id',
  })
  findOne(@Param() { id }: IdParamDto): Promise<ProductResource> {
    return this.productService.findOne(id);
  }

  @Get('filial/:productId')
  @ApiOperation({
    summary: 'Get count of products in filials',
    description: 'Get a list of count of product in filials.',
  })
  getFilialByProduct(@Param('productId') id: string) {
    return this.productService.getFilialByProduct(id);
  }

  @Put('/:id')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update a product using its id',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'Updated successfully',
  })
  @ApiAppException({
    statusCode: HttpStatus.NOT_FOUND,
    description: ExceptionMessage.PRODUCT_NOT_FOUND,
    localCode: ExceptionLocalCode.PRODUCT_NOT_FOUND,
  })
  update(
    @Request() { user }: RequestInterface,
    @Param() { id }: IdParamDto,
    @Body() productDto: UpdateProductCommand,
  ): Promise<boolean> {
    console.log('produuuucccctt: ', productDto);

    return this.productService.update(user.id, id, productDto);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete a product',
    description: 'Delete a product by its id',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'Deleted successfully',
  })
  @ApiAppException({
    statusCode: HttpStatus.NOT_FOUND,
    description: ExceptionMessage.PRODUCT_NOT_FOUND,
    localCode: ExceptionLocalCode.PRODUCT_NOT_FOUND,
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  delete(
    @Request() { user }: RequestInterface,
    @Param() { id }: IdParamDto,
  ): Promise<boolean> {
    return this.productService.delete(user.id, id);
  }
}
