import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TournamentService } from 'src/tournament/services/tournament.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('tournament')
@UseGuards(JwtAuthGuard)
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}
  @Get()
  getTournament() {
    return this.tournamentService.getTournament();
  }
  @Get('id/:id')
  async testLadderLevel(@Param('id') userId: string) {
    //test method
    const num = await this.tournamentService.getLadderLevel(userId);
    console.log(num);
  }
}
