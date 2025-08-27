import { BaseEntity } from '@app/database/entities/base.entity';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { StockMovementEntity } from '../../product/entities/stock-movement.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { WorkerStatusEnum } from '../enums/workers-status.enum';
import { WorkersAttendanceEntity } from './workers-attendance.entity';

@Entity({ schema: 'workers', name: 'workers' })
export class WorkersEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  employeeId!: string;

  @Column()
  accountId!: string;

  @Column()
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  position?: string;

  @Column({ type: 'float', default: 0 })
  salary!: number;

  @Column({ type: 'float', default: 0 })
  commission!: number;

  @Column({ default: WorkerStatusEnum.INACTIVE })
  status!: WorkerStatusEnum;

  @Column({ nullable: true })
  manager?: string;

  @Column({ type: 'simple-json', nullable: true })
  skills?: string[];

  @Column({ nullable: true })
  notes?: string;

  @Column({ default: 0 })
  salesTarget!: number;

  @BeforeInsert()
  generateEmployeeId(): void {
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    this.employeeId = `EMP${randomNum}`;
  }

  @OneToMany(() => WorkersAttendanceEntity, (att) => att.worker)
  attendances!: WorkersAttendanceEntity[];

  @ManyToOne(() => UserEntity, (us) => us.worker)
  account!: UserEntity;
}
