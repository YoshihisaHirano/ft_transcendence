import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/dtos/createUser.dto';
import { FriendshipDto } from 'src/dtos/friendship.dto';
import { ShortResponseUserDto } from 'src/dtos/shortResponseUser.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    newUser.isOnline = true;
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
      ` SELECT id, username, "isOnline"
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
  async findUserIdByLogin(login: string) {
    const user = await this.userRepository.findOne({ where: { login: login } });
    if (user == null) {
      return null;
    }
    return user.id;
  }
  async updateUserPicture(id: string, image: string) {
    const user = await this.findUserById(id);
    user.image = image;
    return this.userRepository.save(user);
  }
}
