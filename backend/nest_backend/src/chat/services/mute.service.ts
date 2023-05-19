import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mute } from 'src/entities/mute.entity';
import { Chat } from 'src/entities';

@Injectable()
export class MuteService {
  constructor(
    @InjectRepository(Mute)
    private readonly muteRepository: Repository<Mute>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
  ) {}
  findInMuteList(chatId: string, userId: string) {
    if (!chatId || !userId) {
      throw new BadRequestException("chatId or userId is undefined!");
    }
    return this.muteRepository.findOne({
      where: {
        chatId: chatId,
        userId: userId,
      },
    });
  }
  getMinDiff(startDate: Date, endDate: Date) {
    if (!startDate || !endDate) {
      throw new BadRequestException("dates are undefined!")
    }
    const msInMin = 60 * 1000;
    return Math.round(Math.abs(Number(endDate) - Number(startDate)) / msInMin);
  }
  async addToMuteList(chatId: string, userId: string) {
    const chat = await this.chatRepository.findOne({
      where: { chatId: chatId },
    });
    if (chat == null) {
      throw new BadRequestException("chat wasn't found!")
    }
    if (userId == chat.ownerId) {
      throw new BadRequestException("Owner rights error!");
    }
    let muteEntity = await this.findInMuteList(chatId, userId);
    const addedTo = new Date();
    if (muteEntity == null) {
      muteEntity = this.muteRepository.create({
        chatId,
        userId,
        addedTo,
      });
      return this.muteRepository.save(muteEntity);
    }
    muteEntity.addedTo = addedTo;
    return this.muteRepository.save(muteEntity);
  }
  async deleteFromMuteList(chatId: string, userId: string) {
    if (!chatId || !userId) {
      throw new BadRequestException("chatId or userId is undefined!");
    }
    const muteEntity = await this.findInMuteList(chatId, userId);
    if (muteEntity == null) {
      return;
    }
    return this.muteRepository.remove(muteEntity);
  }
  async isInMuteList(chatId: string, userId: string): Promise<boolean> {
    if (!chatId || !userId) {
      throw new BadRequestException("chatId or userId is undefined!");
    }
    const muteEntity = await this.findInMuteList(chatId, userId);
    if (muteEntity == null) {
      return false;
    }
    const diff = this.getMinDiff(new Date(), muteEntity.addedTo);
    if (diff < 10) {
      return true;
    } else {
      await this.muteRepository.remove(muteEntity);
      return false;
    }
  }
  async getTimeTillUnmute(chatId: string, userId: string): Promise<number> {
    if (!chatId || !userId) {
      throw new BadRequestException("chatId or userId is undefined!");
    }
    const muteEntity = await this.findInMuteList(chatId, userId);
    if (muteEntity == null) {
      return 0;
    }
    const diff = this.getMinDiff(new Date(), muteEntity.addedTo);
    if (10 - diff < 0) {
      await this.muteRepository.remove(muteEntity);
      return 0;
    }
    return 10 - diff;
  }
}
