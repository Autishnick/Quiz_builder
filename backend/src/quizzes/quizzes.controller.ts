import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuestionType } from '@prisma/client';

interface CreateQuizDto {
  title: string;
  questions: {
    text: string;
    type: QuestionType;
    options?: any;
  }[];
}

@Controller('quizzes')
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) { }

  @Post()
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get()
  findAll() {
    return this.quizzesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.quizzesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }
}
