import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum PrivacyMode {
  PUBLIC = 'public',
  PRIVATE = 'private',
  PROTECTED = 'protected',
}
@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  chatId: string;
  @Column()
  chatname: string;
  @Column('text', { array: true })
  members: string[];
  @Column()
  ownerId: string;
  @Column('text', { array: true })
  adminIds: string[];
  @Column({
    type: 'enum',
    enum: PrivacyMode,
  })
  privacyMode: PrivacyMode;
  @Column({ nullable: true })
  password: string;
  @Column('text', { array: true })
  banList: string[];
  @Column()
  isDirect: boolean;
  @CreateDateColumn()
  createdDate: Date;
}
