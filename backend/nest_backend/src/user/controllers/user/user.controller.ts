import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from 'src/user/services/user/user.service';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { FriendshipDto } from 'src/dtos/friendship.dto';
import { TournamentService } from 'src/tournament/services/tournament.service';
import { StatsService } from 'src/stats/services/stats.service';
import { Stats } from 'src/entities';
import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';
import { TournamentDto } from 'src/dtos/tournament.dto';
import { ResponseUserDto } from 'src/dtos/responseUser.dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tournamentService: TournamentService,
    private readonly statsService: StatsService,
  ) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('/:id')
  async getUserById(@Param('id') id: string): Promise<ResponseUserDto> {
    const stats: Stats[] = await this.statsService.getUserStats(id);
    const friends: ShortResponseUserDto[] =
      await this.userService.findFriendsDto(id);
    const tournamentStats: TournamentDto =
      await this.tournamentService.getTournamentStats(id);
    const user = await this.userService.findUserById(id);
    return {
      id: user.id,
      image: user.image,
      username: user.username,
      isOnline: user.isOnline,
      matchHistory: stats,
      friends: friends,
      tournamentStats: tournamentStats,
    };
  }

  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    const user = await this.userService.createUser(createUserDto);
    await this.tournamentService.addUser(user);
    const tournamentStats: TournamentDto = {
      wins: 0,
      losses: 0,
      ladderLevel: await this.tournamentService.getLadderLevel(user.id),
    };
    return {
      id: user.id,
      image: user.image,
      username: user.username,
      isOnline: user.isOnline,
      matchHistory: [],
      friends: [],
      tournamentStats: tournamentStats,
    };
  }

  @Post('addfriend')
  addFriends(@Body() friendshipDto: FriendshipDto) {
    return this.userService.addFriend(friendshipDto);
  }
  @Get('friends/:id')
  //test method
  getFriends(@Param('id') id: string) {
    return this.userService.findFriends(id);
  }
  @Post('deletefriend')
  deleteFriends(@Body() friendshipDto: FriendshipDto) {
    return this.userService.deleteFriend(friendshipDto);
  }
}
