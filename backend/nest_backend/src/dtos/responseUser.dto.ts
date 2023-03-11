import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';
import { Stats } from 'src/entities';
import { TournamentDto } from 'src/dtos/tournament.dto';

export class ResponseUserDto {
  id: string;
  image: string;
  username: string;
  isOnline: boolean;
  matchHistory: Stats[];

  friends: ShortResponseUserDto[];
  tournamentStats: TournamentDto;
}
