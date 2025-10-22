import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Contest } from './entities/contest.entity';
import { CreateContestDto } from './dto/create-contest.dto';
import { Redis } from 'ioredis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { Option } from './entities/option.entity';

@Injectable()
export class ContestsService {
    constructor(
        @InjectRepository(Contest)
        private readonly contestRepo: Repository<Contest>,
        @InjectRepository(Question)
        private readonly questionRepo: Repository<Question>,
        @InjectRepository(Option)
        private readonly optionRepo: Repository<Option>,
        @Inject(CACHE_MANAGER) private cache: Redis
    ) { }

    async createContest(dto: CreateContestDto) {
        const contest = this.contestRepo.create(dto);
        const saved = await this.contestRepo.save(contest);
        try {
            await this.cache.del('all_contests');
            await this.cache.set(`contest:${saved.id}`, JSON.stringify(saved), 'EX', 60);
        } catch (_) {
        }
        return saved;
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


    async addQuestion(contest_id: string, dto: CreateQuestionDto) {
        const contest = await this.contestRepo.findOne({ where: { id: contest_id } });
        if (!contest) throw new NotFoundException('Contest not found');

        const question = this.questionRepo.create({
            contest,
            question_text: dto.question_text,
            type: dto.type,
        });
        await this.questionRepo.save(question);

        const options = dto.options.map((opt) =>
            this.optionRepo.create({
                question,
                option_text: opt.option_text,
                is_correct: opt.is_correct,
            }),
        );

        console.log("My Options", options);
        
        await this.optionRepo.save(options);

        return await this.questionRepo.findOne({
            where: { id: question.id },
            relations: ['options'],
        });
    }


    async getQuestions(contest_id: string) {
        return await this.questionRepo.find({
            where: { contest: { id: contest_id } },
            relations: ['options'],
        });
    }

}
