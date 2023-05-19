import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stats } from 'src/entities';
import { StatsDto } from 'src/dtos/stats.dto';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Stats)
    private readonly statsRepository: Repository<Stats>,
  ) {}
  getStats() {
    return this.statsRepository.find();
  }
  addStats(statsDto: StatsDto) {
    if (!statsDto) {
      throw new BadRequestException("statsDto is undefined!");
    }
    const newStats = this.statsRepository.create(statsDto);
    return this.statsRepository.save(newStats);
  }
  async getUserStats(userId: string) {
    if (!userId) {
      throw new BadRequestException("userId is undefined!");
    }
    const stats = await this.statsRepository.find({
      where: [{ userOneId: userId }, { userTwoId: userId }],
      take: 10,
      order: { createdDate: 'DESC' },
    });
    return stats.map((item) => {
      delete item.id;
      delete item.createdDate;
      return item;
    });
  }
}
