import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from '@app/database/database.module';
import { LoggerModule } from '@app/logger/logger.module';
import { RabbitModule } from '@app/rabbit/rabbit.module';

import { rateLimitOptions } from './constants/rate-limit';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { ClientsModule } from './modules/clients/clients.module';
import { FilialsModule } from './modules/filials/filials.module';
import { FinanceModule } from './modules/finance/n.module';
import { ProductModule } from './modules/product/product.module';
import { SystemModule } from './modules/system/system.module';
import { UserModule } from './modules/users/user.module';
import { WorkersModule } from './modules/workers/workers.module';

@Module({
  imports: [
    /** Logger module */
    LoggerModule,

    /** Database module */
    DatabaseModule,

    /** RabbitMQ module */
    RabbitModule,

    /** Throttler module (Rate limit module) */
    ThrottlerModule.forRoot([rateLimitOptions]),

    /** Application modules */
    SystemModule,
    AuthModule,
    UserModule,
    CategoryModule,
    ProductModule,
    ClientsModule,
    WorkersModule,
    FilialsModule,
    FinanceModule,
  ],
})
export class AppModule {}
