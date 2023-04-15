import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from '../../entities';
import { Repository } from 'typeorm';
import { CreateMessageDto } from 'src/dtos/createMessage.dto';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}
  showAllMessages() {
    return this.messageRepository.find();
  }
  createMessage(createMessageDto: CreateMessageDto) {
    const newMessage = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(newMessage);
  }
  findChatMessages(chatId: string) {
    return this.messageRepository.find({
      where: {
        chatId: chatId,
      },
      order: {
        createdDate: 'ASC',
      },
    });
  }
}
