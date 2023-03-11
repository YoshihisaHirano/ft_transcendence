import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  Unique,
} from 'typeorm';

@Entity('users')
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  image: string;
  @Column()
  username: string;
  @Column()
  login: string;
  @Column()
  isOnline: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];
}
