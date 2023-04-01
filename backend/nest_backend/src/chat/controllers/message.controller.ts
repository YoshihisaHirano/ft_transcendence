import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessageService } from '../services/message.service';
import { CreateMessageDto } from '../../dtos/createMessage.dto';

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
