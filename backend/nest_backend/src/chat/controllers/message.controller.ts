import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MessageService } from 'src/chat/services/message.service';
import { CreateMessageDto } from 'src/dtos/createMessage.dto';
import JwtTwoFactorGuard from 'src/auth/jwt-2fa-guard';

@UseGuards(JwtTwoFactorGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}
  @Get('all')
  showAllMessages() {
    return this.messageService.showAllMessages();
  }
  @Post('create')
  createMessage(@Body() createMessageDto: CreateMessageDto) {
    return this.messageService.createMessage(createMessageDto);
  }
  @Get('chat/:chatId')
  findChatMessages(@Param('chatId') chatId: string) {
    return this.messageService.findChatMessages(chatId);
  }
}
