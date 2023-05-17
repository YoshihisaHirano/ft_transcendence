import { Body, Controller, Get, Param, Post, UseFilters, UseGuards } from '@nestjs/common';
import { StatsService } from 'src/stats/services/stats.service';
import { StatsDto } from 'src/dtos/stats.dto';
import { TournamentService } from 'src/tournament/services/tournament.service';
import JwtTwoFactorGuard from 'src/auth/jwt-2fa-guard';
import { HttpExceptionFilter } from 'src/utils/http-exception.filter';

@UseGuards(JwtTwoFactorGuard)
@UseFilters(HttpExceptionFilter)
@Controller('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly tournamentService: TournamentService,
  ) {}
  @Get()
  getStats() {
    return this.statsService.getStats();
  }
  @Get('id/:id')
  async getUserStats(@Param('id') userId: string) {
    //test method
    return this.statsService.getUserStats(userId);
  }
  @Post('create')
  async createStats(@Body() statsDto: StatsDto) {
    await this.tournamentService.updateTournament(statsDto);
    return this.statsService.addStats(statsDto);
  }
}
