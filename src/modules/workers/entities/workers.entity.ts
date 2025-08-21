import { BaseEntity } from '@app/database/entities/base.entity';
import { BeforeInsert, Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Unique } from 'typeorm';

import { FilialsEntity } from '../../filials/entities/filials.entity';
import { WorkersRoleEnum } from '../enums/workers-role.enum';
import { WorkerStatusEnum } from '../enums/workers-status.enum';
import { WorkersAttendanceEntity } from './workers-attendance.entity';

@Entity({ schema: 'workers', name: 'workers' })
@Unique(['email'])
export class WorkersEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 20, unique: true })
  employeeId!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName?: string;

  @Column()
  email!: string;

  @Column()
  phone?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  department?: string;

  @Column()
  filialId!: string;

  @ManyToOne(() => FilialsEntity, (fl) => fl.workers)
  filial!: FilialsEntity;

  @Column({ nullable: true })
  position?: string;

  @Column({ default: WorkersRoleEnum.WORKER })
  role!: WorkersRoleEnum;

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
  generateEmployeeId() {
    const randomNum = Math.floor(1000 + Math.random() * 9000);

    this.employeeId = `EMP${randomNum}`;
  }

  @OneToMany(() => WorkersAttendanceEntity, (att) => att.worker)
  attendances!: WorkersAttendanceEntity[];
}
