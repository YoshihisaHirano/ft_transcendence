import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Mute {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  chatId: string;
  @Column()
  userId: string;
  @Column()
  addedTo: Date;
}
