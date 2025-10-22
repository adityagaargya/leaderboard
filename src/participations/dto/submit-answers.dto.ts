import { IsUUID, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerItem {
  @IsUUID() question_id: string;
  @IsArray() selected_option_ids: string[];
}

export class SubmitAnswersDto {
  @IsUUID() user_contest_id: string;
  @ValidateNested({ each: true })
  @Type(() => AnswerItem)
  answers: AnswerItem[];
}
