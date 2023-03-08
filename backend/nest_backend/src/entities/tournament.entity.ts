import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Tournament {
  @PrimaryColumn()
  playerId: string;
  @Column()
  username: string;
  @Column()
  wins: number;
  @Column()
  losses: number;
}
