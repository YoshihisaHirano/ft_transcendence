import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from 'src/entities';
import { Repository } from 'typeorm';
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
    if (createChatDto === null || createChatDto === undefined) {
      throw new BadRequestException("createChatDto is undefined!");
    } 
    if (createChatDto.password != null) {
      createChatDto.password = await bcrypt.hash(createChatDto.password, 10);
    }
    const newChat = this.chatRepository.create(createChatDto);
    newChat.banList = [];
    newChat.adminIds = [newChat.ownerId];
    return this.chatRepository.save(newChat);
  }
  getAllChats() {
    return this.chatRepository.find();
  }
  getChatsWhereUserIsMember(userId: string) {
    if (userId === null || userId === undefined) {
      throw new BadRequestException("userId is undefined!");
    }
    return this.chatRepository
      .createQueryBuilder('chat')
      .where(':id = ANY (chat.members)', { id: userId })
      .orderBy('chat.createdDate', 'DESC')
      .getMany();
  }
  async addUsersToChat(usersId: string[], chatId: string) {
    if (usersId === null || usersId === undefined) {
      throw new BadRequestException("usersId is undefined!");
    }
    if (chatId === null || chatId === undefined) {
      throw new BadRequestException("chatId is undefined!");
    }
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat === null) {
      throw new BadRequestException("chat wasn't found");
    }
    for (let user of usersId) {
      if (user == null || user == undefined) {
        throw new BadRequestException("One of added users is null");
      }
      if (!chat.members.includes(user)) {
        chat.members.push(user);
      }
    }
    return this.chatRepository.save(chat);
  }
  async addAdminsToChat(usersId: string[], chatId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat === null) {
      throw new BadRequestException("chat wasn't found");
    }
    chat.adminIds.push(...usersId);
    return this.chatRepository.save(chat);
  }
  async deleteUserOfChat(userId: string, chatId: string, isByHimself: boolean ) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat === null) {
      throw new BadRequestException("chat wasn't found");
    }
    if (chat.ownerId == userId && !isByHimself) {
      throw new BadRequestException("owner rights error!");
    }
    let adminsId = chat.adminIds;
    adminsId = adminsId.filter((member) => member != userId);
    let membersId = chat.members;
    membersId = membersId.filter((member) => member != userId);
    if (membersId.length == 0) {
      return this.chatRepository.remove(chat);
    }
    chat.members = membersId;
    chat.adminIds = adminsId;
    if (userId == chat.ownerId && adminsId.length != 0) {
      chat.ownerId = adminsId[0];
    }
    if (adminsId.length == 0) {
      chat.adminIds = [membersId[0]];
      chat.ownerId = membersId[0];
    }
    return this.chatRepository.save(chat);
  }
  async checkPassword(chatId: string, password: string) {
    if (chatId === null || chatId === undefined) {
      throw new BadRequestException("chatId is undefined!");
    }
    if (!password) {
      throw new BadRequestException("password is undefined!")
    }
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat === null) {
      throw new BadRequestException("chat wasn't found");
    }
    return bcrypt.compare(password, chat.password);
  }
  async updateSettings(updateChatDto: UpdateChatDto) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: updateChatDto.chatId },
    });
    if (chat === null) {
      throw new BadRequestException("chat wasn't found");
    }
    chat.adminIds = updateChatDto.adminIds;
    chat.chatname = updateChatDto.chatname;
    chat.privacyMode = updateChatDto.privacyMode;
    if (chat.privacyMode == PrivacyMode.PROTECTED) {
      if (updateChatDto.password != "" && updateChatDto.password != null) {
        chat.password = await bcrypt.hash(updateChatDto.password, 10);
      }
    } else {
      chat.password = null;
    }
    return this.chatRepository.save(chat);
  }
  async banUser(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat === null) {
      throw new BadRequestException("chat wasn't found");
    }
    if (userId == chat.ownerId) {
      throw new BadRequestException("owner rights error!");
    }
    chat.banList.push(userId);
    return this.chatRepository.save(chat);
  }
  async unbanUser(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat === null) {
      throw new BadRequestException("chat wasn't found");
    }
    chat.banList = chat.banList.filter((id) => id != userId);
    return this.chatRepository.save(chat);
  }
  async checkBan(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat === null) {
      throw new BadRequestException("chat wasn't found");
    }
    return chat.banList.includes(userId);
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
    if (!chatId || !userId) {
      throw new BadRequestException("chat or user is undefined!")
    }
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat === null) {
      return false;
    }
    return chat.members.includes(userId);
  }
  deleteChat(chatId: string) {
    if (!chatId) {
      throw new BadRequestException("chatId is undefined!")
    }
    return this.chatRepository.delete({ chatId: chatId });
  }
  findById(id: string) {
    return this.chatRepository.findOne({
      where: { chatId: id },
    });
  }
}
