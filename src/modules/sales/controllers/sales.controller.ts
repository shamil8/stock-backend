import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { use } from 'passport';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RequestInterface } from '../../auth/interfaces/request.interface';
import { InvoiceCommand } from '../dto/command/invoice.command';
import { UpdateInvoiceStatusCommand } from '../dto/command/update-invoice-status.command';
import { SalesService } from '../serivces/sales.service';

@ApiTags('Sales')
@Controller('Sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new sale',
    description: 'Create a new sale',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  addInvoice(
    @Request() { user }: RequestInterface,
    @Body() command: InvoiceCommand,
  ) {
    console.log(user.id);

    return this.salesService.create(command, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all sales',
    description: 'Get sales',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  getAllInvoices() {
    return this.salesService.getAllInvoices();
  }

  @Put('/:id')
  @ApiOperation({
    summary: 'Update a sale status',
    description: 'Update a sale status',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  updateStatus(
    @Request() { user }: RequestInterface,
    @Param('id') id: string,
    @Body() command: UpdateInvoiceStatusCommand,
  ) {
    return this.salesService.updateStatus(id, command, user.id);
  }

  // @Put('/:id')
  // @ApiOperation({
  //   summary: 'Update sale status',
  //   description: 'Update a sale',
  // })
  // @UseGuards(JwtAccessGuard)
  // @ApiBearerAuth()
  // @ApiOkResponse({
  //   type: Boolean,
  //   description: 'Successfully update sale status',
  // })
  // updateInvoice(
  //   @Param('id') id: string,
  //   @Body() command: UpdateInvoiceStatusCommand,
  // ) {
  //   return this.salesService.updateInvoice(id, command);
  // }
}
