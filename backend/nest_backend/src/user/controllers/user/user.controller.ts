import {
  Body,
  Controller,
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
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tournamentService: TournamentService,
    private readonly statsService: StatsService,
    private readonly authService: AuthService,
  ) {}

  @Post('/login')
  async userLogin(@Body('login') login: string) {
    const id = await this.userService.findUserIdByLogin(login);
    const token = await this.authService.login(login);
    return {
      id: id,
      token: token,
    };
  }
  @Get()
  getUsers() {
    //test method
    return this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/id/:id')
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

  @UseGuards(JwtAuthGuard)
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
      image: user.image,
      username: user.username,
      isOnline: user.isOnline,
      matchHistory: [],
      friends: [],
      tournamentStats: tournamentStats,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('addfriend')
  addFriends(@Body() friendshipDto: FriendshipDto) {
    return this.userService.addFriend(friendshipDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get('friends/:id')
  //test method
  getFriends(@Param('id') id: string) {
    return this.userService.findFriends(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('deletefriend')
  deleteFriends(@Body() friendshipDto: FriendshipDto) {
    return this.userService.deleteFriend(friendshipDto);
  }
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async updateUser(@Param('id') id: string, @Body('image') image: string) {
    const user = await this.userService.updateUserPicture(id, image);
    return this.getUserById(user.id);
  }
  @Get('/test/password')
  async TestMethod() {
    //password testing
    const saltOrRounds = 10;
    const password = 'password';
    const hash = await bcrypt.hash(password, saltOrRounds);
    console.log(hash);
    const input = 'pasword';
    const isMatch = await bcrypt.compare(input, hash);
    console.log(isMatch);
  }
}
