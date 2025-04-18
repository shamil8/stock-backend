import { BaseEntity } from '@app/database/entities/base.entity';
import { pbkdf2Sync, randomBytes } from 'crypto';
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';

import { CountryEntity } from '../../system/entities/country.entity';
import { LanguageCode } from '../../system/enums/language-code';
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

  @Column({ length: 3, default: LanguageCode.EN })
  langCode!: LanguageCode;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ select: false })
  password!: string;

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
}
