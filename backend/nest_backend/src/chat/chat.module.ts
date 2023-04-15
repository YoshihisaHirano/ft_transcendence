import { Module } from '@nestjs/common';
import { ChatController } from './controllers/chat.controller';
import { ChatService } from './services/chat.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat, Message } from 'src/entities';
import { MessageService } from './services/message.service';
import { MessageController } from './controllers/message.controller';
import { ChatGateway } from './chat.gateway';
import { UserModule } from 'src/user/user.module';
import { Mute } from '../entities/mute.entity';
import { MuteService } from './services/mute.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    TypeOrmModule.forFeature([Message]),
    TypeOrmModule.forFeature([Mute]),
    UserModule,
  ],
  controllers: [ChatController, MessageController],
  providers: [ChatService, MessageService, ChatGateway, MuteService],
})
export class ChatModule {}
