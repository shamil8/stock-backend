import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getNANOID } from '@app/crypto-utils/functions/export-settings';
import { FindAndCountType } from '@app/crypto-utils/interfaces/find-and-count.type';
import { LoggerService } from '@app/logger/services/logger.service';
import { Repository } from 'typeorm';

import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { AppHttpException } from '../../../filters/app-http.exception';
import { FilialRepository } from '../../filials/repositories/filial.repository';
import { ChangeUserPasswordCommand } from '../dto/command/change-user-password.command';
import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserListQuery } from '../dto/query/user-list.query';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    private readonly logger: LoggerService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly filialRepository: FilialRepository,
  ) {}

  async findUsers(query: UserListQuery): FindAndCountType<UserEntity> {
    return this.userRepository
      .createQueryBuilder('users')
      .AndSearch(
        ['users.firstName', 'users.lastName', 'users.email'],
        query.text,
      )
      .orderBy('users.firstName', 'ASC')
      .skip(query.getSkip())
      .take(query.take)
      .getManyAndCount();
  }

  async findByColumn<TColumn extends keyof UserEntity>(
    column: TColumn,
    value: UserEntity[TColumn],
    select?: (keyof UserEntity)[],
  ): Promise<UserEntity> {
    const builder = this.userRepository.createQueryBuilder('user');

    if (select && select.length > 0) {
      const selectWithAlias = select.map((col) => `user.${col}`);

      builder.select(selectWithAlias);
    }

    const user = await builder
      .where(`user.${column} = :value`, { value })
      .getOne();

    if (user) {
      return user;
    }

    throw new AppHttpException(
      ExceptionMessage.USER_NOT_FOUND,
      HttpStatus.NOT_FOUND,
      ExceptionLocalCode.USER_NOT_FOUND,
    );
  }

  async findById(id: string) {
    const user = await this.findByColumn('id', id);

    const filialName = await this.filialRepository.getBiIdOrThrow(
      user.filialsId,
    );

    return {
      ...user,
      filialName: filialName.name,
      avatar: `http://localhost:5002/api${user.avatar}`,
    };
  }

  async storeUser(command: StoreUserCommand): Promise<UserEntity> {
    const user = this.userRepository.create({
      email: command.email,
      password: command.password,
      firstName: command.firstName,
      lastName: command.lastName,
      username: this.getUsernameFromEmail(command.email),
      department: command.department,
      filialsId: command.filialId,
      role: command.role,
    });

    return this.userRepository.save(user);
  }

  getUsernameFromEmail(email: string): string {
    return `${email.split('@')[0]}_${getNANOID()}`;
  }

  async uploadAvatar(userId: string, fileName: string): Promise<boolean> {
    const user = await this.findById(userId);

    user.avatar = fileName;

    await this.userRepository.save(user);

    return true;
  }

  async changePassword(userId: string, command: ChangeUserPasswordCommand) {
    const user = await this.findByColumn('id', userId, [
      'id',
      'email',
      'password',
      'username',
      'firstName',
      'lastName',
      'role',
      'department',
      'filialsId',
    ]);

    if (!user || !user.validatePassword(command.currentPassword)) {
      throw new AppHttpException(
        ExceptionMessage.WRONG_PASSWORD,
        HttpStatus.FORBIDDEN,
        ExceptionLocalCode.WRONG_PASSWORD,
      );
    }

    user.password = command.newPassword;

    await this.userRepository.save(user);

    return true;
  }
}
