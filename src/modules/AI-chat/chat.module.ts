import { Module } from '@nestjs/common';

import { ProductModule } from '../product/product.module';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';

@Module({
  imports: [ProductModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
