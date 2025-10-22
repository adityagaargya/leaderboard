import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserContest, ParticipationStatus } from './entities/user-contest.entity';
import { UserAnswer } from './entities/user-answer.entity';
import { Contest } from '../contests/entities/contest.entity';
import { Option } from '../contests/entities/option.entity';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { Redis } from 'ioredis';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ParticipationsService {
  constructor(
    @InjectRepository(UserContest) private userContestRepo: Repository<UserContest>,
    @InjectRepository(UserAnswer) private userAnswerRepo: Repository<UserAnswer>,
    @InjectRepository(Contest) private contestRepo: Repository<Contest>,
    @InjectRepository(Option) private optionRepo: Repository<Option>,
    @Inject(CACHE_MANAGER) private cache: Redis
  ) {}

  async joinContest(user_id: string, contest_id: string) {
    const contest = await this.contestRepo.findOne({ where: { id: contest_id } });
    if (!contest) throw new NotFoundException('Contest not found');

    const existing = await this.userContestRepo.findOne({
      where: { user: { id: user_id }, contest: { id: contest_id } },
    });
    if (existing) return existing;

    const entry = this.userContestRepo.create({ user: { id: user_id }, contest });
    return await this.userContestRepo.save(entry);
  }

  async submitAnswers(user_id: string, dto: SubmitAnswersDto) {
    const participation = await this.userContestRepo.findOne({
      where: { id: dto.user_contest_id },
      relations: ['contest'],
    });

    if (!participation) throw new NotFoundException('Participation not found');
    if (participation.status === ParticipationStatus.SUBMITTED)
      throw new ForbiddenException('Already submitted');

    // Save answers
    for (const ans of dto.answers) {
      const entry = this.userAnswerRepo.create({
        user_contest: participation,
        question: { id: ans.question_id },
        selected_option_ids: ans.selected_option_ids,
      });
      await this.userAnswerRepo.save(entry);
    }

    // Calculate score
    const correctOptions = await this.optionRepo.find({
      where: { is_correct: true },
    });

    let score = 0;
    for (const ans of dto.answers) {
      const correctIds = correctOptions
        .filter((opt) => opt.question.id === ans.question_id)
        .map((o) => o.id)
        .sort();

      const userIds = [...ans.selected_option_ids].sort();

      if (JSON.stringify(correctIds) === JSON.stringify(userIds)) {
        score++;
      }
    }

    participation.score = score;
    participation.status = ParticipationStatus.SUBMITTED;
    await this.userContestRepo.save(participation);

    // Update leaderboard cache
    const leaderboardKey = `leaderboard:${participation.contest.id}`;
    await this.cache.zadd(leaderboardKey, score, user_id); 
    return { message: 'Submission complete', score };
  }

  async getLeaderboard(contest_id: string, limit = 10) {
    const leaderboardKey = `leaderboard:${contest_id}`;
    const cached = await this.cache.zrevrange(leaderboardKey, 0, limit - 1, 'WITHSCORES');
    if (cached.length === 0) return [];

    const formatted : any = [];
    for (let i = 0; i < cached.length; i += 2) {
      formatted.push({ user_id: cached[i], score: parseInt(cached[i + 1], 10) });
    }
    return formatted;
  }
}
