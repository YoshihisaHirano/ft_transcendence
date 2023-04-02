import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat, Message } from 'src/entities';
import { MessageService } from './services/message.service';
import { MessageController } from './controllers/message.controller';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    TypeOrmModule.forFeature([Message]),
  ],
  controllers: [ChatController, MessageController],
  providers: [ChatService, MessageService, ChatGateway],
})
export class ChatModule {}