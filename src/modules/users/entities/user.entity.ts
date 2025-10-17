import { BaseEntity } from '@app/database/entities/base.entity';
import { pbkdf2Sync, randomBytes } from 'crypto';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { FilialsEntity } from '../../filials/entities/filials.entity';
import { BorrowEntity } from '../../finance/entities/borrows.entity';
import { TransactionEntity } from '../../finance/entities/transaction.entity';
import { ProductHistoryEntity } from '../../product/entities/productHistory.entity';
import { StockMovementEntity } from '../../product/entities/stock-movement.entity';
import { SalesEntity } from '../../sales/entities/sales.entity';
import { CountryEntity } from '../../system/entities/country.entity';
import { LanguageCode } from '../../system/enums/language-code';
import { WorkersEntity } from '../../workers/entities/workers.entity';
import { UserRole } from '../enums/user-role';

@Entity({ schema: 'users', name: 'users' })
export class UserEntity extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ length: 55 })
  role!: UserRole;

  @Column({ nullable: false })
  department!: string;

  @Column({ nullable: false })
  filialsId!: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ length: 3, default: LanguageCode.EN })
  langCode!: LanguageCode;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ select: false })
  password!: string;

  @Column({ nullable: true })
  lastLogin?: Date;

  @Column({ nullable: true })
  countryId?: string;

  @BeforeInsert()
  @BeforeUpdate()
  private hashPassword(): void {
    if (!this.password) {
      return;
    }

    const salt = randomBytes(16).toString('hex'); // Generate a salt
    const hash = pbkdf2Sync(this.password, salt, 10000, 64, 'sha512').toString(
      'hex',
    );

    this.password = `${salt}:${hash}`; // Store both salt and hash
  }

  validatePassword(password: string): boolean {
    if (!this.password) return false;

    const [salt, storedHash] = this.password.split(':');

    if (!salt || !storedHash) return false;

    const hash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString(
      'hex',
    );

    return hash === storedHash;
  }

  @ManyToOne(() => CountryEntity, (country) => country.users)
  country?: CountryEntity;

  @ManyToOne(() => FilialsEntity, (fl) => fl.users, { onDelete: 'CASCADE' })
  filials!: FilialsEntity;

  @OneToMany(() => WorkersEntity, (wk) => wk.account)
  worker!: WorkersEntity;

  @OneToMany(() => StockMovementEntity, (st) => st.user)
  movements!: StockMovementEntity[];

  @OneToMany(() => ProductHistoryEntity, (ph) => ph.user)
  productHistory!: ProductHistoryEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions?: TransactionEntity[];

  @OneToMany(() => SalesEntity, (invoices) => invoices.user)
  invoices?: SalesEntity[];

  @OneToMany(() => BorrowEntity, (borrows) => borrows.user)
  borrows?: BorrowEntity[];
}
