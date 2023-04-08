import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';
import { Stats } from 'src/entities';
import { TournamentDto } from 'src/dtos/tournament.dto';

export enum Achievement {
  NONE = 'none',
  BEGINNER = 'beginner',
  EXPERIENCED = 'experienced',
  MASTER = 'master',
}

export class ResponseUserDto {
  id: string;
  image: string;
  username: string;
  isOnline: boolean;
  matchHistory: Stats[];

  friends: ShortResponseUserDto[];
  tournamentStats: TournamentDto;
  achievement: Achievement;
}
