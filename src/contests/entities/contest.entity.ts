import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Question } from './question.entity';

export enum ContestAccessLevel {
  NORMAL = 'NORMAL',
  VIP = 'VIP',
}

@Entity('contests')
export class Contest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ContestAccessLevel, default: ContestAccessLevel.NORMAL })
  access_level: ContestAccessLevel;

  @Column({ type: 'timestamp' })
  start_time: Date;

  @Column({ type: 'timestamp' })
  end_time: Date;

  @Column({ type: 'text', nullable: true })
  prize_info: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => Question, (q) => q.contest)
  questions: Question[];
}
