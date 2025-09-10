import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ChatService } from '../services/chat.service';

@ApiTags('AI-Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(@Body() message: { message: string }) {
    const reply = await this.chatService.askAI(message.message);

    console.log(reply);

    return { reply };
  }
}
