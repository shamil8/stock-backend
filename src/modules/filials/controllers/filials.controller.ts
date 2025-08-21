import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { FilialCommand } from '../dto/command/filial.command';
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
    summary: 'Get all products',
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
}
