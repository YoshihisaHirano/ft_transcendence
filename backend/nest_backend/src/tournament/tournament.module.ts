import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tournament } from 'src/entities/tournament.entity';
import { TournamentController } from 'src/tournament/controllers/tournament.controller';
import { TournamentService } from 'src/tournament/services/tournament.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tournament])],
  controllers: [TournamentController],
  providers: [TournamentService],
  exports: [TournamentService],
})
export class TournamentModule {}
