import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QuestionType } from '@prisma/client';

@Injectable()
export class QuizzesService {
  constructor(private prisma: PrismaService) { }

  async create(data: { title: string; questions: { text: string; type: QuestionType; options?: any }[] }) {
    return this.prisma.quiz.create({
      data: {
        title: data.title,
        questions: {
          create: data.questions.map((q) => ({
            text: q.text,
            type: q.type,
            options: q.options || null,
          })),
        },
      },
      include: {
        questions: true,
      },
    });
  }

  async findAll() {
    const quizzes = await this.prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      questionCount: q._count.questions,
      createdAt: q.createdAt,
    }));
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }

    return quiz;
  }

  async remove(id: string) {
    try {
      return await this.prisma.quiz.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
  }
}
