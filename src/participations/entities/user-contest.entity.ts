import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';

import { Contest } from '../../contests/entities/contest.entity';
import { User } from 'src/users/user.entity';

export enum ParticipationStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  SUBMITTED = 'SUBMITTED',
}

@Entity('user_contests')
export class UserContest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Contest, { onDelete: 'CASCADE' })
  contest: Contest;

  @Column({ type: 'enum', enum: ParticipationStatus, default: ParticipationStatus.IN_PROGRESS })
  status: ParticipationStatus;

  @Column({ type: 'int', default: 0 })
  score: number;

  @CreateDateColumn()
  created_at: Date;
}
