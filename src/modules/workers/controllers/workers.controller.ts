import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { WorkersCommand } from '../dto/command/workers.command';
import { WorkersService } from '../services/workers.service';

@ApiTags('Workers')
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}
  @Post()
  @ApiOperation({
    summary: 'Add a new worker',
    description: 'Add a new worker',
  })
  addWorker(@Body() command: WorkersCommand) {
    return this.workersService.addWorker(command);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all workers',
    description: 'Get all workers',
  })
  getAllWorkers() {
    return this.workersService.getAllWorkers();
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete worker',
    description: 'Delete worker by id',
  })
  deleteWorker(@Param('id') id: string) {
    return this.workersService.deleteWorker(id);
  }
}
