import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { UpdateWorkersCommand } from '../dto/command/update-workers.command';
import { WorkersCommand } from '../dto/command/workers.command';
import { WorkersResource } from '../dto/resource/worker.resource';
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
  addWorker(@Body() command: WorkersCommand): Promise<boolean> {
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

  @Put(':id')
  @ApiOperation({
    summary: 'Update worker',
    description: 'Updateworker by id',
  })
  updateWorker(
    @Param('id') id: string,
    @Body() command: UpdateWorkersCommand,
  ): Promise<WorkersResource> {
    console.log('iddd', id);

    return this.workersService.updateWorker(id, command);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete worker',
    description: 'Delete worker by id',
  })
  deleteWorker(@Param('id') id: string): Promise<boolean> {
    return this.workersService.deleteWorker(id);
  }
}
