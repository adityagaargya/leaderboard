import { IsString, IsEnum, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionType } from '../entities/question.entity';

class OptionDto {
  @IsString() option_text: string;
  @IsBoolean()
  @Type(() => Boolean)
  is_correct: boolean;
}

export class CreateQuestionDto {
  @IsString() question_text: string;
  @IsEnum(QuestionType) type: QuestionType;
  @IsArray() @ValidateNested({ each: true }) @Type(() => OptionDto)
  options: OptionDto[];
}
