import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Question } from './question.entity';

@Entity('options')
export class Option {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Question, (question) => question.options, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @Column({ type: 'text' })
  option_text: string;

  @Column({ default: false })
  is_correct: boolean;
}
