import { BaseEntity } from '@app/database/entities/base.entity';
import { Column, Entity } from 'typeorm';
import { Unique } from 'typeorm';

import { WorkersRoleEnum } from '../enums/workers-role.enum';
import { WorkerStatusEnum } from '../enums/workers-status.enum';

@Entity({ schema: 'users', name: 'workers' })
@Unique(['email'])
export class WorkersEntity extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  email!: string;

  @Column()
  phone?: string;

  @Column({ default: WorkersRoleEnum.WORKER })
  role!: WorkersRoleEnum;

  @Column()
  department?: string;

  @Column({ default: WorkerStatusEnum.INACTIVE })
  status!: WorkerStatusEnum;
}
