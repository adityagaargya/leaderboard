import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Contest } from './contest.entity';
import { Option } from './option.entity';

export enum QuestionType {
  SINGLE = 'SINGLE',
  MULTI = 'MULTI',
  TRUE_FALSE = 'TRUE_FALSE',
}

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  
  @ManyToOne(() => Contest, (contest) => contest.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'contest_id' })
  contest: Contest;

  @Column({ type: 'text' })
  question_text: string;

  @Column({ type: 'enum', enum: QuestionType })
  type: QuestionType;

  @OneToMany(() => Option, (o) => o.question)
  options: Option[];
}
