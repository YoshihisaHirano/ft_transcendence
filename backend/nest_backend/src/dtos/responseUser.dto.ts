import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';
import { Stats } from 'src/entities';
import { TournamentDto } from 'src/dtos/tournament.dto';
import { StatusMode } from "../entities/user.entity";

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
  status: StatusMode;
  matchHistory: Stats[];

  friends: ShortResponseUserDto[];
  tournamentStats: TournamentDto;
  achievement: Achievement;
  blacklist: string[];
}
