import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TournamentService } from 'src/tournament/services/tournament.service';
import JwtTwoFactorGuard from 'src/auth/jwt-2fa-guard';

@Controller('tournament')
@UseGuards(JwtTwoFactorGuard)
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
    //(console.log)(num);
  }
}
