import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';
import { Stats } from 'src/entities';
import { TournamentDto } from 'src/dtos/tournament.dto';
import { GameMode, StatusMode } from 'src/entities/user.entity';

export enum Achievement {
  NONE = 'none',
  BEGINNER = 'novice',
  EXPERIENCED = 'expert',
  MASTER = 'master',
}

export class ResponseUserDto {
  id: string;
  login: string;
  image: string;
  username: string;
  status: StatusMode;
  matchHistory: Stats[];
  friends: ShortResponseUserDto[];
  tournamentStats: TournamentDto;
  achievement: Achievement;
  blacklist: string[];
  gameMode: GameMode;
  twoFactorAuthIsEnabled: boolean;
}
