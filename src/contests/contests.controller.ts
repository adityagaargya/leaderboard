import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { Roles } from '../auth/roles.decorator';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { RolesGuard } from 'src/auth/roles.gaurd';
import { UserRole } from 'src/users/user.entity';
import { CreateQuestionDto } from './dto/create-question.dto';

@Controller('contests')
export class ContestsController {
    constructor(private readonly contestsService: ContestsService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post()
    create(@Body() dto: CreateContestDto) {
        return this.contestsService.createContest(dto);
    }

    @Get()
    findAll() {
        return this.contestsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.contestsService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.contestsService.deleteContest(id);
    }


    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Post(':contest_id/questions')
    addQuestion(@Param('contest_id') contest_id: string, @Body() dto: CreateQuestionDto) {
        return this.contestsService.addQuestion(contest_id, dto);
    }

    @Get(':contest_id/questions')
    getQuestions(@Param('contest_id') contest_id: string) {
        return this.contestsService.getQuestions(contest_id);
    }
}
