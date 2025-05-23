import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
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
import { CategoryCommand } from '../dto/command/category.command';
import { UpdateCategoryCommand } from '../dto/command/update-category.command';
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
  @ApiOkResponse({
    type: CategoryResource,
    description: 'Got new category',
  })
  @ApiAppException({
    statusCode: HttpStatus.CONFLICT,
    description: ExceptionMessage.CATEGORY_EXISTS,
    localCode: ExceptionLocalCode.CATEGORY_EXISTS,
  })
  @ApiAppException({
    statusCode: HttpStatus.NOT_FOUND,
    description: ExceptionMessage.CATEGORY_NOT_FOUND,
    localCode: ExceptionLocalCode.CATEGORY_NOT_FOUND,
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  create(@Body() category: CategoryCommand): Promise<CategoryResource> {
    return this.service.create(category);
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
  @ApiOkResponse({
    type: Boolean,
    description: 'Update a category using its id',
  })
  @ApiAppException({
    statusCode: HttpStatus.NOT_FOUND,
    description: ExceptionMessage.CATEGORY_NOT_FOUND,
    localCode: ExceptionLocalCode.CATEGORY_NOT_FOUND,
  })
  update(
    @Param() { id }: IdParamDto,
    @Body() command: UpdateCategoryCommand,
  ): Promise<boolean> {
    return this.service.update(id, command);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category.',
    description: 'Delete a category by its id.',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'Update a category using its id',
  })
  @ApiAppException({
    statusCode: HttpStatus.NOT_FOUND,
    description: ExceptionMessage.CATEGORY_NOT_FOUND,
    localCode: ExceptionLocalCode.CATEGORY_NOT_FOUND,
  })
  delete(@Param() { id }: IdParamDto): Promise<boolean> {
    return this.service.delete(id);
  }
}
