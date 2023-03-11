import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Stats {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  playerOneId: string;
  @Column()
  usernameOne: string;
  @Column()
  scoreOne: number;
  @Column()
  playerTwoId: string;
  @Column()
  usernameTwo: string;
  @Column()
  scoreTwo: number;
}
