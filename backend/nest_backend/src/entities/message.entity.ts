import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  text: string;
  @Column()
  authorUsername: string;
  @Column()
  authorId: string;
  @Column()
  chatId: string;
  @CreateDateColumn()
  createdDate: Date;
}
