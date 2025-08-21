import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { TimeEntryStatusEnum } from '../../enums/time-entry-status.enum';

export class WorkersAttendaceCommand {
  @ApiProperty({
    example: '13:30',
    description:
      'Clock-in time when the worker started their shift, in HH:mm format.',
  })
  @IsNotEmpty()
  @IsString()
  clockIn!: string;

  @ApiProperty({
    example: '20:30',
    description:
      'Clock-out time when the worker ended their shift, in HH:mm format. Optional if the shift is still ongoing.',
  })
  @IsString()
  clockOut?: string;

  @ApiProperty({
    example: TimeEntryStatusEnum.PRESENT,
    description:
      'The attendance status for this time entry. Possible values: PRESENT, ABSENT, LATE, ON_LEAVE, etc.',
  })
  @IsString()
  status!: TimeEntryStatusEnum;

  @ApiProperty({
    example: 'Worked extra 2 hours due to high workload',
    description: 'Optional notes or remarks about this attendance entry.',
  })
  @IsString()
  note?: string;
}
