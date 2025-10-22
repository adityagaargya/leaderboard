import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContestsService } from './contests.service';
import { ContestsController } from './contests.controller';
import { Contest } from './entities/contest.entity';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contest, Question, Option]),
  ],
  controllers: [ContestsController],
  providers: [ContestsService],
  exports: [ContestsService],
})
export class ContestsModule {}
