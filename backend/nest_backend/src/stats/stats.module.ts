import { Stats } from 'src/entities';
import { StatsService } from 'src/stats/services/stats.service';
import { StatsController } from 'src/stats/controllers/stats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TournamentModule } from 'src/tournament/tournament.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stats]), TournamentModule],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
