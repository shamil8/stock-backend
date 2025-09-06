import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  ApiResponsePaginated,
  PageResType,
} from '@app/crypto-utils/decorators/page-response.decorator';
import { diskStorage } from 'multer';
import { extname } from 'path';

import {
  authRateLimitOptions,
  rateLimitOptions,
} from '../../../constants/rate-limit';
import { ApiAppException } from '../../../dto/resource/app-exception.resource';
import { ExceptionLocalCode } from '../../../enums/exception-local-code';
import { ExceptionMessage } from '../../../enums/exception-message';
import { CustomThrottlerGuard } from '../../auth/guards/custom-throttel.guard';
import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { RequestInterface } from '../../auth/interfaces/request.interface';
import { ChangeUserPasswordCommand } from '../dto/command/change-user-password.command';
import { StoreUserCommand } from '../dto/command/store-user.command';
import { UserListQuery } from '../dto/query/user-list.query';
import { UserResource } from '../dto/resource/user.resource';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller({ path: 'users' })
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'This route can call all users',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @ApiResponsePaginated(UserResource)
  async getUsers(@Query() query: UserListQuery): PageResType<UserResource> {
    return this.usersService.getUsers(query);
  }

  @Post()
  @ApiOperation({
    summary: 'Create user',
    description: 'Route for creating user',
  })
  @UseGuards(CustomThrottlerGuard)
  @Throttle({ default: authRateLimitOptions })
  @ApiOkResponse({
    type: UserResource,
    description: 'Created new user',
  })
  @ApiAppException({
    statusCode: HttpStatus.CONFLICT,
    description: ExceptionMessage.EMAIL_EXISTS,
    localCode: ExceptionLocalCode.EMAIL_EXISTS,
  })
  createUser(@Body() command: StoreUserCommand): Promise<UserResource> {
    return this.usersService.createUser(command);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
    description: 'Get user by id',
  })
  findById(@Param('id') id: string) {
    console.log('idddddd', id);

    return this.usersService.findById(id);
  }

  @Put('/avatar')
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @Throttle({ defult: rateLimitOptions })
  @ApiOperation({
    summary: 'Update avatar',
    description: 'Update users avatar',
  })
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (
          req: Express.Request,
          file: Express.Multer.File,
          callback: (error: Error | null, filename: string) => void,
        ) => {
          const ext = extname(file.originalname);
          const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9,
          )}${ext}`;

          callback(null, uniqueName);
        },
      }),
    }),
  )
  async uploadAvatar(
    @Request() { user }: RequestInterface,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const filePath = `/uploads/avatars/${file.filename}`;

    return this.usersService.uploadAvatar(user.id, filePath);
  }

  @Put('password')
  @ApiOperation({
    summary: 'Change password',
    description: 'Change user password',
  })
  @UseGuards(JwtAccessGuard)
  @ApiBearerAuth()
  @Throttle({ default: authRateLimitOptions })
  @ApiOkResponse({
    type: Boolean,
    description: 'Password changed successfully',
  })
  changePassword(
    @Request() { user }: RequestInterface,
    @Body() command: ChangeUserPasswordCommand,
  ): Promise<boolean> {
    return this.usersService.changePassword(user.id, command);
  }
}
