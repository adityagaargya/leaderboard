import { IsString, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ContestAccessLevel } from '../entities/contest.entity';

export class CreateContestDto {
  @IsString() name: string;
  @IsOptional() @IsString() description?: string;
  @IsEnum(ContestAccessLevel) access_level: ContestAccessLevel;
  @IsDateString() start_time: string;
  @IsDateString() end_time: string;
  @IsOptional() @IsString() prize_info?: string;
}
