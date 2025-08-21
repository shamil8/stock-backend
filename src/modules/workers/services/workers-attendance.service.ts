import { Injectable } from '@nestjs/common';

import { WorkersAttendaceCommand } from '../dto/command/w-attendace.command';
import { AttendanceListQuery } from '../dto/query/attendance-list.query';
import { WorkersAttendanceRepository } from '../repositories/workers-attendance.repository';

@Injectable()
export class WorkersAttendanceService {
  constructor(
    private readonly wAttendanceRepository: WorkersAttendanceRepository,
  ) {}

  async addAttendance(workerId: string, command: WorkersAttendaceCommand) {
    return this.wAttendanceRepository.addAttendance(workerId, command);
  }

  getAttendance(date: AttendanceListQuery) {
    return this.wAttendanceRepository.getAttendanceByDate(date);
  }
}
