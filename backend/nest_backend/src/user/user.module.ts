import { Module } from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities';
import { TournamentModule } from 'src/tournament/tournament.module';
import { StatsModule } from 'src/stats/stats.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), TournamentModule, StatsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
