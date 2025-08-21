import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { WorkersAttendaceCommand } from '../dto/command/w-attendace.command';
import { AttendanceListQuery } from '../dto/query/attendance-list.query';
import { WorkersAttendanceService } from '../services/workers-attendance.service';

@ApiTags('Workers attendance')
@Controller('workers-attendance')
export class WorkersAttendanceController {
  constructor(private readonly workersRepository: WorkersAttendanceService) {}

  @Post(':id')
  @ApiOperation({
    summary: 'Add an Attendance',
    description: 'Add an daily worker Attendance',
  })
  addAttendance(
    @Param('id') workerId: string,
    @Body() command: WorkersAttendaceCommand,
  ) {
    return this.workersRepository.addAttendance(workerId, command);
  }

  @Get(':date')
  getAttendance(@Query() date: AttendanceListQuery) {
    return this.workersRepository.getAttendance(date);
  }
}
