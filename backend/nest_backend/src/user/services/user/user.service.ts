import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { FriendshipDto } from 'src/dtos/friendship.dto';
import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';
import { GameMode, StatusMode } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    newUser.status = StatusMode.ONLINE;
    newUser.blacklist = [];
    newUser.twoFactorAuthIsEnabled = false;
    newUser.twoFactorAuthSecret = null;
    return this.userRepository.save(newUser).catch((e) => {
      if (/(already exists)/.test(e.detail)) {
        throw new BadRequestException(
          'Account with this username already exists.',
        );
      }
      return e;
    });
  }

  findUserById(id: string) {
    return this.userRepository.findOne({ where: { id: id } });
  }
  getUsers() {
    return this.userRepository.find();
  }

  async addFriend(friendshipDto: FriendshipDto) {
    const user = await this.findUserById(friendshipDto.userId);
    const friend = await this.findUserById(friendshipDto.friendId);
    user.friends = await this.findFriends(friendshipDto.userId);
    if (user.friends) {
      user.friends.push(friend);
    } else {
      user.friends = [friend];
    }
    await this.userRepository.save(user);
  }

  async deleteFriend(friendshipDto: FriendshipDto) {
    const user = await this.findUserById(friendshipDto.userId);
    let friends = await this.findFriends(friendshipDto.userId);
    friends = friends.filter((user) => user.id != friendshipDto.friendId);
    user.friends = friends;
    await this.userRepository.save(user);
  }

  async findFriends(id: string): Promise<User[]> {
    return await this.userRepository.query(
      ` SELECT * 
        FROM users U
        WHERE U.id <> $1
          AND EXISTS(
            SELECT 1
            FROM users_friends_users F
            WHERE (F."usersId_1" = $1 AND F."usersId_2" = U.id )
            OR (F."usersId_2" = $1 AND F."usersId_1" = U.id )
            );  `,
      [id],
    );
  }

  async findFriendsDto(id: string): Promise<ShortResponseUserDto[]> {
    return await this.userRepository.query(
      ` SELECT id, username, status
        FROM users U
        WHERE U.id <> $1
          AND EXISTS(
            SELECT 1
            FROM users_friends_users F
            WHERE (F."usersId_1" = $1 AND F."usersId_2" = U.id )
            OR (F."usersId_2" = $1 AND F."usersId_1" = U.id )
            );  `,
      [id],
    );
  }
  async findUserByLogin(login: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.login = :login', { login: login })
      .getOne();
    if (user == null) {
      return null;
    }
    return user;
  }

  async findUserIdByLogin(login: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.login = :login', { login: login })
      .getOne();
    if (user == null) {
      return {
        user: null
      };
    }
    return user.id;
  }

  async findUsernameById(id: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();
    if (user == null) {
      return null;
    }
    return user.username;
  }
  async updateUserPicture(id: string, image: string) {
    const user = await this.findUserById(id);
    user.image = image;
    return this.userRepository.save(user);
  }
  async addToBlacklist(userId: string, blackId: string) {
    const user = await this.findUserById(userId);
    if (!user.blacklist.includes(blackId)) {
      user.blacklist.push(blackId);
    }
    return this.userRepository.save(user);
  }
  async deleteFromBlacklist(userId: string, blackId: string) {
    const user = await this.findUserById(userId);
    if (user.blacklist.includes(blackId)) {
      user.blacklist = user.blacklist.filter((id) => id != blackId);
    }
    return this.userRepository.save(user);
  }
  async checkBlacklist(userId: string, checkId: string) {
    const user = await this.findUserById(userId);
    return user.blacklist.includes(checkId);
  }
  async getShortInfoById(id: string) {
    return {
        id: id,
        username: await this.findUsernameById(id),
        status: await this.findStatusById(id),
    };
  }
  async getShortInfoByIds(ids: string[]) {
    const res = [];
    for (const id of ids) {
      res.push(await this.getShortInfoById(id));
    }
    return res;
  }
  async setTwoFactorAuthSecret(secret: string, login: string) {
    const user = await this.findUserByLogin(login);
    user.twoFactorAuthSecret = secret;
    return this.userRepository.save(user);
  }
  async switchTwoFactorAuth(login: string, condition: boolean) {
    const user = await this.findUserByLogin(login);
    user.twoFactorAuthIsEnabled = condition;
    return this.userRepository.save(user);
  }
  async changeUserStatus(userId: string, status: StatusMode) {
    const user = await this.findUserById(userId);
    user.status = status;
    return this.userRepository.save(user);
  }
  async findStatusById(userId: string) {
    const user = await this.findUserById(userId);
    return user.status;
  }
  async changeGameMode(userId: string, mode: GameMode) {
    const user = await this.findUserById(userId);
    user.preferredGameMode = mode;
    return this.userRepository.save(user);
  }
}
