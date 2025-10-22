import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { UserContest } from './user-contest.entity';
import { Question } from '../../contests/entities/question.entity';

@Entity('user_answers')
export class UserAnswer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserContest, { onDelete: 'CASCADE' })
  user_contest: UserContest;

  @ManyToOne(() => Question, { onDelete: 'CASCADE' })
  question: Question;

  @Column('uuid', { array: true })
  selected_option_ids: string[];
}
