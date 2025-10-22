import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';

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
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Contest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contest_id' }) 
  contest: Contest;

  @Column({ type: 'enum', enum: ParticipationStatus, default: ParticipationStatus.IN_PROGRESS })
  status: ParticipationStatus;

  @Column({ type: 'int', default: 0 })
  score: number;

  @CreateDateColumn()
  created_at: Date;
}
