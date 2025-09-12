import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';

import { JwtAccessGuard } from '../../auth/guards/jwt-access.guard';
import { ChatCommand } from '../dto/chat.command';
import { ChatService } from '../services/chat.service';

@UseGuards(JwtAccessGuard)
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async streamMessage(@Body() question: ChatCommand, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    await this.chatService.askAIStream(question.massage, (chunk) => {
      res.write(chunk);
    });

    res.end();
  }

  @Post('reset')
  @ApiOperation({
    summary: 'Reset the chat',
    description: 'Reset the chat (clear history from the chat))',
  })
  @ApiOkResponse({
    type: Boolean,
    description: 'Reseted the chat successfully.',
  })
  resetHistory(): boolean {
    return this.chatService.resetHistory();
  }
}
