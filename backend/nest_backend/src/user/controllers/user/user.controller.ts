import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from 'src/user/services/user/user.service';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { FriendshipDto } from 'src/dtos/friendship.dto';
import { TournamentService } from 'src/tournament/services/tournament.service';
import { StatsService } from 'src/stats/services/stats.service';
import { Stats } from 'src/entities';
import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';
import { TournamentDto } from 'src/dtos/tournament.dto';
import { ResponseUserDto } from 'src/dtos/responseUser.dto';
import JwtTwoFactorGuard from 'src/auth/jwt-2fa-guard';
import { GameMode } from '../../../entities/user.entity';

@UseGuards(JwtTwoFactorGuard)
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tournamentService: TournamentService,
    private readonly statsService: StatsService,
  ) {}
  @Get()
  getUsers() {
    //test method
    return this.userService.getUsers();
  }
  @Get('/id/:id')
  async getUserById(@Param('id') id: string): Promise<ResponseUserDto> {
    const stats: Stats[] = await this.statsService.getUserStats(id);
    const friends: ShortResponseUserDto[] =
      await this.userService.findFriendsDto(id);
    const tournamentStats: TournamentDto =
      await this.tournamentService.getTournamentStats(id);
    const user = await this.userService.findUserById(id);
    if (user == null) {
      return null;
    }
    return {
      id: user.id,
      login: user.login,
      image: user.image,
      username: user.username,
      status: user.status,
      matchHistory: stats,
      friends: friends,
      tournamentStats: tournamentStats,
      achievement: await this.tournamentService.getAchievements(user.id),
      blacklist: user.blacklist,
      gameMode: user.preferredGameMode,
      twoFactorAuthIsEnabled: user.twoFactorAuthIsEnabled,
    };
  }
  @Post('create')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    let user;
    try {
      user = await this.userService.createUser(createUserDto);
    } catch (err) {
      throw err;
    }
    await this.tournamentService.addUser(user);
    const tournamentStats: TournamentDto = {
      wins: 0,
      losses: 0,
      ladderLevel: await this.tournamentService.getLadderLevel(user.id),
    };
    return {
      id: user.id,
      login: user.login,
      image: user.image,
      username: user.username,
      status: user.status,
      matchHistory: [],
      friends: [],
      tournamentStats: tournamentStats,
      achievement: await this.tournamentService.getAchievements(user.id),
      blacklist: user.blacklist,
      gameMode: user.preferredGameMode,
      twoFactorAuthIsEnabled: user.twoFactorAuthIsEnabled,
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
  @Put('update')
  async updateUser(@Body('id') id: string, @Body('image') image: string) {
    const user = await this.userService.updateUserPicture(id, image);
    return this.getUserById(user.id);
  }
  @Put('blacklist')
  addUserToBlacklist(
    @Body('userId') userId: string,
    @Body('blackId') blackId: string,
  ) {
    return this.userService.addToBlacklist(userId, blackId);
  }
  @Delete('blacklist')
  deleteUserFromBlacklist(
    @Body('userId') userId: string,
    @Body('blackId') blackId: string,
  ) {
    return this.userService.deleteFromBlacklist(userId, blackId);
  }
  @Get('blacklist/:userId/:checkId')
  checkIfUserInBlacklist(
    @Param('userId') userId: string,
    @Param('checkId') checkId: string,
  ) {
    return this.userService.checkBlacklist(userId, checkId);
  }
  @Put('changemode')
  changeGameMode(
    @Body('userId') userId: string,
    @Body('mode') mode: GameMode,
  ) {
    return this.userService.changeGameMode(userId, mode);
  }
  @Get('username/:username')
  getLoginById(@Param('username') username: string) {
    return this.userService.findUserIdByUsername(username);
  }
}
