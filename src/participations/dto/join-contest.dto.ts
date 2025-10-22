import { IsUUID } from 'class-validator';

export class JoinContestDto {
  @IsUUID()
  contest_id: string;
}
