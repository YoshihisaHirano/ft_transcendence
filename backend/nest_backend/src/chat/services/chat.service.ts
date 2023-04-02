import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities';
import { Brackets, Repository } from 'typeorm';
import { CreateChatDto } from 'src/dtos/createChat.dto';
import * as bcrypt from 'bcrypt';
import { UpdateChatDto } from 'src/dtos/updateChat.dto';
import { PrivacyMode } from 'src/entities/chat.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
  ) {}
  async createChat(createChatDto: CreateChatDto) {
    if (createChatDto.password != null) {
      createChatDto.password = await bcrypt.hash(createChatDto.password, 10);
    }
    const newChat = this.chatRepository.create(createChatDto);
    newChat.muteList = [];
    return this.chatRepository.save(newChat);
  }
  getAllChats() {
    return this.chatRepository.find();
  }
  getChatsWhereUserIsMember(userId: string) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .where(':id = ANY (chat.members)', { id: userId })
      .orderBy('chat.createdDate', 'DESC')
      .getMany();
  }
  async addUsersToChat(usersId: string[], chatId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    chat.members.push(...usersId);
    return this.chatRepository.save(chat);
  }
  async deleteUserOfChat(userId: string, chatId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    let membersId = chat.members;
    membersId = membersId.filter((member) => member != userId);
    chat.members = membersId;
    return this.chatRepository.save(chat);
  }
  async checkPassword(chatId: string, password: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    return bcrypt.compare(password, chat.password);
  }
  async updateSettings(updateChatDto: UpdateChatDto) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: updateChatDto.chatId },
    });
    chat.adminId = updateChatDto.adminId;
    chat.chatname = updateChatDto.chatname;
    chat.privacyMode = updateChatDto.privacyMode;
    if (chat.privacyMode == PrivacyMode.PROTECTED) {
      chat.password = await bcrypt.hash(updateChatDto.password, 10);
    } else {
      chat.password = null;
    }
    return this.chatRepository.save(chat);
  }
  async muteUser(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    chat.muteList.push(userId);
    return this.chatRepository.save(chat);
  }
  async unmuteUser(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    chat.muteList = chat.muteList.filter((id) => id != userId);
    return this.chatRepository.save(chat);
  }
  async checkMute(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    return chat.muteList.includes(userId);
  }
  async findDirectChat(userOneId: string, userTwoId: string) {
    return this.chatRepository
      .createQueryBuilder('chat')
      .where('chat.isDirect = :direct', { direct: true })
      .andWhere(
        ':firstId = ANY (chat.members) AND :secondId = ANY (chat.members)',
        { firstId: userOneId, secondId: userTwoId },
      )
      .getOne();
  }
  async isUserChatMember(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat == null) {
      return false;
    }
    return chat.members.includes(userId);
  }
}
