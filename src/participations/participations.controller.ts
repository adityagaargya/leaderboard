import { Controller, Post, Body, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ParticipationsService } from './participations.service';
import { JoinContestDto } from './dto/join-contest.dto';
import { SubmitAnswersDto } from './dto/submit-answers.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';


@Controller('participations')
@UseGuards(JwtAuthGuard)
export class ParticipationsController {
    constructor(private readonly participationService: ParticipationsService) { }

    @Post('join')
    join(@Req() req, @Body() dto: JoinContestDto) {
        return this.participationService.joinContest(req.user.id, dto.contest_id);
    }

    @Post('submit')
    submit(@Req() req, @Body() dto: SubmitAnswersDto) {
        return this.participationService.submitAnswers(req.user.id, dto);
    }

    @Get('leaderboard/:contest_id')
    getLeaderboard(@Param('contest_id') contest_id: string) {
        return this.participationService.getLeaderboard(contest_id);
    }

    @Get('/my-contests')
    @UseGuards(JwtAuthGuard)
    async getMyContests(@Req() req) {
        const userId = req.user.id;
        return await this.participationService.getUserContests(userId);
    }
}
