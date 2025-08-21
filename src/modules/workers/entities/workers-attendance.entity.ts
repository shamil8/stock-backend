import { BaseEntity } from '@app/database/entities/base.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';

import { TimeEntryStatusEnum } from '../enums/time-entry-status.enum';
import { WorkersEntity } from './workers.entity';

@Entity({ schema: 'workers', name: 'attendance' })
export class WorkersAttendanceEntity extends BaseEntity {
  @Column()
  workerId!: string;

  @ManyToOne(() => WorkersEntity, (w) => w.attendances)
  worker!: WorkersEntity;

  @Column({ default: () => `to_char(NOW(), 'HH24:MI')` })
  clockIn!: string;

  @Column({ nullable: true })
  clockOut?: string;

  @Column({ default: 0, nullable: false })
  totalHours!: string;

  @Column({ default: TimeEntryStatusEnum.PRESENT })
  status!: TimeEntryStatusEnum;

  @Column({ nullable: true })
  note?: string;

  @Column({ nullable: true })
  beakStart?: string;

  @Column({ nullable: true })
  beakEnd?: string;

  @BeforeInsert()
  @BeforeUpdate()
  calculateTotalHours() {
    if (this.clockIn) {
      const [inH, inM] = this.clockIn.split(':').map(Number);

      let outH: number;
      let outM: number;

      if (this.clockOut) {
        [outH, outM] = this.clockOut.split(':').map(Number);
      } else {
        const now = new Date();

        outH = now.getHours();
        outM = now.getMinutes();
      }

      const inMinutes = inH * 60 + inM;
      const outMinutes = outH * 60 + outM;

      let diff = outMinutes - inMinutes;

      if (diff < 0) diff += 24 * 60;

      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      this.totalHours = `${hours}:${minutes.toString().padStart(2, '0')}`;
    } else {
      this.totalHours = '0:00';
    }
  }
}
