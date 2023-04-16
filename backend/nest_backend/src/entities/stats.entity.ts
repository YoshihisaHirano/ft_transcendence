import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Stats {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  userOneId: string;
  @Column()
  userOneName: string;
  @Column()
  userOneScore: number;
  @Column()
  userTwoId: string;
  @Column()
  userTwoName: string;
  @Column()
  userTwoScore: number;
  @CreateDateColumn()
  createdDate: Date;
}
