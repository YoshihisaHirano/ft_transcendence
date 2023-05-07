import {
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
  Unique,
} from 'typeorm';

export enum StatusMode {
  ONLINE = 'online',
  OFFLINE = 'offline',
  GAME = 'game',
}

export enum GameMode {
  EASY = 'easy',
  DEFAULT = 'default',
  HARD = 'hard',
}

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
  @Column({
    type: 'enum',
    enum: StatusMode,
  })
  status: StatusMode;

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[];

  @Column('text', { array: true })
  blacklist: string[];
  @Column({ default: false })
  twoFactorAuthIsEnabled: boolean;
  @Column({ nullable: true })
  twoFactorAuthSecret: string;
  @Column({
    type: 'enum',
    enum: GameMode,
    default: GameMode.DEFAULT,
  })
  preferredGameMode: GameMode;
}
