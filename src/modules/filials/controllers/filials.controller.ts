import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { FilialCommand } from '../dto/command/filial.command';
import { UpdateFilialCommand } from '../dto/command/update-filial.command';
import { FilialsService } from '../services/filials.service';

@ApiTags('Filials')
@Controller('filials')
export class FilialsController {
  constructor(private readonly filialsService: FilialsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a filial', description: 'Add a new filial' })
  addFilial(@Body() command: FilialCommand) {
    return this.filialsService.addFilial(command);
  }

  @Get('/:filialId')
  @ApiOperation({
    summary: 'Get all products that are in filial',
    description: 'Get all products that are in this filial',
  })
  getProductsByFilial(@Param('filialId') filialId: string) {
    return this.filialsService.getProductsByFilial(filialId);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all filials',
    description: 'Get a list of all filials',
  })
  getAllFilials() {
    return this.filialsService.getAllFilials();
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update filial',
    description: 'Update a filial by id',
  })
  updateFilial(@Param('id') id: string, @Body() command: UpdateFilialCommand) {
    return this.filialsService.updateFilial(id, command);
  }

  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete filial',
    description: 'Delete filial by id',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Successfully deleted filial',
    type: Boolean,
  })
  delete(@Param('id') id: string): Promise<boolean> {
    return this.filialsService.delete(id);
  }
}
