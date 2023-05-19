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

  async createUser(createUserDto: CreateUserDto) {
    if (!createUserDto) {
      throw new BadRequestException("CreateUserDto is undefined!");
    }
    const userId = await this.findUserIdByUsername(createUserDto.username);
    if (userId.user != null) {
      throw new BadRequestException("Account with this username already exists");
    }
    const newUser = this.userRepository.create(createUserDto);
    newUser.status = StatusMode.ONLINE;
    newUser.blacklist = [];
    newUser.twoFactorAuthIsEnabled = false;
    newUser.twoFactorAuthSecret = null;
    return this.userRepository.save(newUser);
  }

  findUserById(id: string) {
    if (!id) {
      throw new BadRequestException("Id is undefined!");
    }
    return this.userRepository.findOne({ where: { id: id } });
  }
  getUsers() {
    return this.userRepository.find();
  }

  async addFriend(friendshipDto: FriendshipDto) {
    if (!friendshipDto) {
      throw new BadRequestException("friendshipDto is undefined!");
    }
    const user = await this.findUserById(friendshipDto.userId);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    const friend = await this.findUserById(friendshipDto.friendId);
    if (friend == null) {
      throw new BadRequestException("friend not found!")
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
      throw new BadRequestException("FriendshipDto is undefined!");
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
      throw new BadRequestException("id is undefined!");
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
      throw new BadRequestException("id is undefined!");
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
      throw new BadRequestException("login is undefined!");
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
      throw new BadRequestException("Username is undefined!");
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
      throw new BadRequestException("id is undefined!");
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
  async updateUser(userId: string, image: string) {
    if (!userId || !image) {
      throw new BadRequestException("userId or image is undefined!");
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    user.image = image;
    const obj = await this.userRepository.save(user);
    return {
      id: userId,
      username: obj.username,
      status: obj.status,
    };
  }
  async addToBlacklist(userId: string, blackId: string) {
    if (!userId || !blackId) {
      throw new BadRequestException("userId or blackId is undefined!");
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    if (!user.blacklist.includes(blackId)) {
      user.blacklist.push(blackId);
    }
    return this.userRepository.save(user);
  }
  async deleteFromBlacklist(userId: string, blackId: string) {
    if (!userId || !blackId) {
      throw new BadRequestException("userId or blackId is undefined!");
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    if (user.blacklist.includes(blackId)) {
      user.blacklist = user.blacklist.filter((id) => id != blackId);
    }
    return this.userRepository.save(user);
  }
  async checkBlacklist(userId: string, checkId: string) {
    if (!userId || !checkId) {
      throw new BadRequestException("userId or checkId is undefined")
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    return user.blacklist.includes(checkId);
  }
  async getShortInfoById(id: string) {
    if (!id) {
      throw new BadRequestException("id is undefined!");
    }
    return {
        id: id,
        username: await this.findUsernameById(id),
        status: await this.findStatusById(id),
    };
  }
  async getShortInfoByIds(ids: string[]) {
    if (!ids) {
      throw new BadRequestException("ids are undefined!");
    }
    const res = [];
    for (const id of ids) {
      res.push(await this.getShortInfoById(id));
    }
    return res;
  }
  async setTwoFactorAuthSecret(secret: string, login: string) {
    if (!secret || !login) {
      throw new BadRequestException("secret code or login is undefined!");
    }
    const user = await this.findUserByLogin(login);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    user.twoFactorAuthSecret = secret;
    return this.userRepository.save(user);
  }
  async switchTwoFactorAuth(login: string, condition: boolean) {
    if (!login) {
      throw new BadRequestException("login is undefined!");
    }
    const user = await this.findUserByLogin(login);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    user.twoFactorAuthIsEnabled = condition;
    const obj = await this.userRepository.save(user);
    // console.log(obj);
    return obj;
  }
  async changeUserStatus(userId: string, status: StatusMode) {
    if (!userId || !status) {
      throw new BadRequestException("userId or status is undefined!")
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    user.status = status;
    return this.userRepository.save(user);
  }
  async findStatusById(userId: string) {
    if (!userId) {
      throw new BadRequestException("userId wasn't found!");
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    return user.status;
  }
  async changeGameMode(userId: string, mode: GameMode) {
    if (!userId || !mode) {
      throw new BadRequestException("userId or gameMode is undefined!");
    }
    const user = await this.findUserById(userId);
    if (user == null) {
      throw new BadRequestException("user not found!");
    }
    user.preferredGameMode = mode;
    return this.userRepository.save(user);
  }
}
