import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Contest } from './entities/contest.entity';
import { CreateContestDto } from './dto/create-contest.dto';
import { Redis } from 'ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ContestsService {
  constructor(
    @InjectRepository(Contest)
    private readonly contestRepo: Repository<Contest>,
    @Inject(CACHE_MANAGER) private cache: Redis
  ) {}

  async createContest(dto: CreateContestDto) {
    const contest = this.contestRepo.create(dto);
    return await this.contestRepo.save(contest);
  }

  async findAll(): Promise<Contest[]> {
    // Redis cache optimization
    const cached = await this.cache.get('all_contests');
    if (cached) return JSON.parse(cached);

    const contests = await this.contestRepo.find({ relations: ['questions', 'questions.options'] });
    await this.cache.set('all_contests', JSON.stringify(contests), 'EX', 60); // 1 min cache
    return contests;
  }

  async findOne(id: string): Promise<Contest> {
    const cacheKey = `contest:${id}`;
    const cached = await this.cache.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const contest = await this.contestRepo.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });
    if (!contest) throw new NotFoundException('Contest not found');

    await this.cache.set(cacheKey, JSON.stringify(contest), 'EX', 60);
    return contest;
  }

  async deleteContest(id: string) {
    const result = await this.contestRepo.delete(id);
    await this.cache.del(`contest:${id}`);
    await this.cache.del('all_contests');
    return result;
  }
}
