import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from 'src/entities/tournament.entity';
import { User } from 'src/entities';
import { StatsDto } from 'src/dtos/stats.dto';
import { TournamentDto } from 'src/dtos/tournament.dto';
import { Achievement } from 'src/dtos/responseUser.dto';

@Injectable()
export class TournamentService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
  ) {}
  getTournament() {
    return this.tournamentRepository.find({
      order: {
        wins: 'DESC',
        losses: 'ASC',
        username: 'ASC',
      },
      take: 10,
    });
  }
  addUser(user: User) {
    if (!user) {
      throw new Error("user is undefined!")
    }
    const newTournamentUser: Tournament = {
      playerId: user.id,
      username: user.username,
      wins: 0,
      losses: 0,
    };
    return this.tournamentRepository.save(newTournamentUser);
  }
  async updateTournament(statsDto: StatsDto) {
    if (!statsDto) {
      throw new Error("StatsDto is undefined!");
    }
    const winnerId =
      statsDto.userOneScore > statsDto.userTwoScore
        ? statsDto.userOneId
        : statsDto.userTwoId;
    const loserId =
      statsDto.userOneScore < statsDto.userTwoScore
        ? statsDto.userOneId
        : statsDto.userTwoId;
    const winnerTournamentStats: Tournament =
      await this.tournamentRepository.findOne({
        where: { playerId: winnerId },
      });
    if (winnerTournamentStats == null) {
      throw new Error("smth wrong with tournament!");
    } 
    const loserTournamentStats: Tournament =
      await this.tournamentRepository.findOne({
        where: { playerId: loserId },
      });
    if (loserTournamentStats == null) {
      throw new Error("smth wrong with tournament!");
    }
    winnerTournamentStats.wins++;
    loserTournamentStats.losses++;
    await this.tournamentRepository.save([
      winnerTournamentStats,
      loserTournamentStats,
    ]);
  }
  async getLadderLevel(userId: string): Promise<number> {
    if (!userId) {
      throw new Error("userId is undefined!")
    }
    const user = await this.tournamentRepository.findOne({
      where: { playerId: userId },
    });
    if (user == null) {
      throw new Error("User is not found!")
    }
    const res = await this.tournamentRepository.query(
      ` SELECT COUNT(*) 
        FROM TOURNAMENT T
        WHERE (T.wins > $1)
        OR (T.wins = $1 AND T.losses < $2)
        OR (T.wins = $1 AND T.losses = $2 AND T.username < $3); `,
      [user.wins, user.losses, user.username],
    );
    return Number(res[0].count) + 1;
  }
  async getTournamentStats(userId: string): Promise<TournamentDto> {
    if (!userId) {
      throw new Error("userId is undefined!");
    }
    const userStats = await this.tournamentRepository.findOne({
      where: { playerId: userId },
    });
    if (userStats == null) {
      throw new Error("user stats weren't found!");
    }
    const ladderLevel = await this.getLadderLevel(userId);
    return {
      wins: userStats.wins,
      losses: userStats.losses,
      ladderLevel: ladderLevel,
    };
  }
  async getAchievements(userId: string) {
    if (!userId) {
      throw new Error("userId is undefined!");
    }
    const userStats = await this.tournamentRepository.findOne({
      where: { playerId: userId },
    });
    if (userStats == null) {
      throw new Error("userStats weren't found!")
    }
    const matches = userStats.wins + userStats.losses;
    if (matches >= 10) {
      return Achievement.MASTER;
    } else if (matches >= 5) {
      return Achievement.EXPERIENCED;
    } else if (matches >= 1) {
      return Achievement.BEGINNER;
    } else {
      return Achievement.NONE;
    }
  }
}
