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

  @Column('text', { array: true })
  blacklist: string[];
  @Column()
  twoFactorAuthIsEnabled: boolean;
  @Column({ nullable: true })
  twoFactorAuthSecret: string;
}
