import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WorkersAttendaceCommand } from '../dto/command/w-attendace.command';
import { AttendanceListQuery } from '../dto/query/attendance-list.query';
import { WorkersAttendanceEntity } from '../entities/workers-attendance.entity';

@Injectable()
export class WorkersAttendanceRepository {
  constructor(
    @InjectRepository(WorkersAttendanceEntity)
    private readonly wAttendanceRepository: Repository<WorkersAttendanceEntity>,
  ) {}

  async addAttendance(workerId: string, command: WorkersAttendaceCommand) {
    console.log('Adding worker attendance', workerId);
    const attendance = this.wAttendanceRepository.create({
      ...command,
      workerId,
    });

    return await this.wAttendanceRepository.save(attendance);
  }

  async getAttendanceByDate(date: AttendanceListQuery) {
    const query = this.wAttendanceRepository.createQueryBuilder('at');

    if (date?.date) {
      query.where('DATE(at.createdAt) = :date', { date: date.date });
    }

    const attendance = await query.getMany();

    return attendance;
  }
}
