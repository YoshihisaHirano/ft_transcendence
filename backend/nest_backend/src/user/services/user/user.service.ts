import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { FriendshipDto } from 'src/dtos/friendship.dto';
import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';
import { GameMode, StatusMode } from 'src/entities/user.entity';
import { UpdateUserDto } from 'src/dtos/updateUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new Error("CreateUserDto is undefined!");
    }
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
    if (!id) {
      throw new Error("Id is undefined!");
    }
    return this.userRepository.findOne({ where: { id: id } });
  }
  getUsers() {
    return this.userRepository.find();
  }

  async addFriend(friendshipDto: FriendshipDto) {
    if (!friendshipDto) {
      throw new Error("friendshipDto is undefined!");
    }
    const user = await this.findUserById(friendshipDto.userId);
    if (user == null) {
      throw new Error("user not found!");
    }
    const friend = await this.findUserById(friendshipDto.friendId);
    if (friend == null) {
      throw new Error("friend not found!")
    }
    user.friends = await this.findFriends(friendshipDto.userId);
    if (user.friends) {
      user.friends.push(friend);
    } else {
      user.friends = [friend];
    }
    await this.userRepository.save(user);
  }

  async deleteFriend(friendshipDto: FriendshipDto) {
    if (!friendshipDto) {
      throw new Error("FriendshipDto is undefined!");
    }
    return await this.userRepository.query(
      ` DELETE FROM users_friends_users u
        WHERE (u."usersId_1" = $1 AND u."usersId_2" = $2)
        OR (u."usersId_1" = $2 AND u."usersId_2" = $1); ` ,
      [friendshipDto.friendId, friendshipDto.userId],
    );
  }

  async findFriends(id: string): Promise<User[]> {
    if (!id) {
      throw new Error("id is undefined!");
    }
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
    if (!id) {
      throw new Error("id is undefined!");
    }
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
    if (!login) {
      throw new Error("login is undefined!");
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.login = :login', { login: login })
      .getOne();
    if (user == null) {
      return null;
    }
    return user;
  }

  async findUserIdByUsername(username: string) {
    if (!username) {
      throw new Error("Username is undefined!");
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username', { username: username })
      .getOne();
    if (user == null) {
      return {
        user: null
      };
    }
    return { user: user.id};
  }

  async findUsernameById(id: string) {
    if (!id) {
      throw new Error("id is undefined!");
    }
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id: id })
      .getOne();
    if (user == null) {
      return null;
    }
    return user.username;
  }
  async updateUser(updateUserDto: UpdateUserDto) {
    if (!updateUserDto) {
      throw new Error("UpdateUserDto is undefined!");
    }
    const user = await this.findUserById(updateUserDto.id);
    if (user == null) {
      throw new Error("user not found!");
    }
    if (user.username != updateUserDto.username) {
      const anotherUser = await this.findUserIdByUsername(updateUserDto.username);
      if (anotherUser.user != null) {
        throw new Error('Account with this username already exists.');
      }
    }
    user.image = updateUserDto.image;
    user.username = updateUserDto.username;
    const obj = await this.userRepository.save(user);
    return {
      id: updateUserDto.id,
      username: obj.username,
      status: obj.status,
    };
  }
  async addToBlacklist(userId: string, blackId: string) {
    if (!userId || !blackId) {
      throw new Error("userId or blackId is undefined!");
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new Error("user not found!");
    }
    if (!user.blacklist.includes(blackId)) {
      user.blacklist.push(blackId);
    }
    return this.userRepository.save(user);
  }
  async deleteFromBlacklist(userId: string, blackId: string) {
    if (!userId || !blackId) {
      throw new Error("userId or blackId is undefined!");
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new Error("user not found!");
    }
    if (user.blacklist.includes(blackId)) {
      user.blacklist = user.blacklist.filter((id) => id != blackId);
    }
    return this.userRepository.save(user);
  }
  async checkBlacklist(userId: string, checkId: string) {
    if (!userId || !checkId) {
      throw new Error("userId or checkId is undefined")
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new Error("user not found!");
    }
    return user.blacklist.includes(checkId);
  }
  async getShortInfoById(id: string) {
    if (!id) {
      throw new Error("id is undefined!");
    }
    return {
        id: id,
        username: await this.findUsernameById(id),
        status: await this.findStatusById(id),
    };
  }
  async getShortInfoByIds(ids: string[]) {
    if (!ids) {
      throw new Error("ids are undefined!");
    }
    const res = [];
    for (const id of ids) {
      res.push(await this.getShortInfoById(id));
    }
    return res;
  }
  async setTwoFactorAuthSecret(secret: string, login: string) {
    if (!secret || !login) {
      throw new Error("secret code or login is undefined!");
    }
    const user = await this.findUserByLogin(login);
    if (user == null) {
      throw new Error("user not found!");
    }
    user.twoFactorAuthSecret = secret;
    return this.userRepository.save(user);
  }
  async switchTwoFactorAuth(login: string, condition: boolean) {
    if (!login || !condition) {
      throw new Error("login or condition is undefined!");
    }
    const user = await this.findUserByLogin(login);
    if (user == null) {
      throw new Error("user not found!");
    }
    user.twoFactorAuthIsEnabled = condition;
    return this.userRepository.save(user);
  }
  async changeUserStatus(userId: string, status: StatusMode) {
    if (!userId || !status) {
      throw new Error("userId or status is undefined!")
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new Error("user not found!");
    }
    user.status = status;
    return this.userRepository.save(user);
  }
  async findStatusById(userId: string) {
    if (!userId) {
      throw new Error("userId wasn't found!");
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new Error("user not found!");
    }
    return user.status;
  }
  async changeGameMode(userId: string, mode: GameMode) {
    if (!userId || !mode) {
      throw new Error("userId or gameMode is undefined!");
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new Error("user not found!");
    }
    user.preferredGameMode = mode;
    return this.userRepository.save(user);
  }
}
