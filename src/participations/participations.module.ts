import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParticipationsService } from './participations.service';
import { ParticipationsController } from './participations.controller';
import { UserContest } from './entities/user-contest.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { Contest } from '../contests/entities/contest.entity';
import { Option } from '../contests/entities/option.entity';
import { User } from 'src/users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserContest, UserAnswer, Contest, Option, User])],
  providers: [ParticipationsService],
  controllers: [ParticipationsController],
  exports: [ParticipationsService],
})
export class ParticipationsModule {}
