import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { BorrowService } from '../services/borrow.service';

@ApiTags('Borrows')
@Controller('borrow')
export class BorrowController {
  constructor(private readonly borrowService: BorrowService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all borrows',
    description: 'Get all borrows',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  getAll() {
    return this.borrowService.getAll();
  }
}
