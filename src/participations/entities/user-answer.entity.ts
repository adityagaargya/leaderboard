import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UserContest } from './user-contest.entity';
import { Question } from '../../contests/entities/question.entity';

@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserContest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_contest_id' })
  user_contest: UserContest;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' }) 
  question: Question;

  @Column('uuid', { array: true })
  selected_option_ids: string[];
}
