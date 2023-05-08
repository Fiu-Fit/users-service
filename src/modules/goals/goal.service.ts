import { Injectable } from '@nestjs/common';
import { Goal } from '@prisma/client';
import { PrismaService } from '../../prisma.service';
import { GoalDTO } from './goal.dto';

@Injectable()
export class GoalService {
  constructor(private prismaService: PrismaService) {}

  async createGoal(goal: GoalDTO): Promise<Goal> {
    const createdGoal = await this.prismaService.goal.create({ data: goal });
    return createdGoal;
  }

  getGoalById(id: number): Promise<Goal | null> {
    return this.prismaService.goal.findUnique({
      where: { id },
    });
  }

  findAll(): Promise<Goal[]> {
    return this.prismaService.goal.findMany({ orderBy: { id: 'asc' } });
  }

  editGoal(id: number, goal: GoalDTO): Promise<Goal> {
    return this.prismaService.goal.update({
      where: { id },
      data:  goal,
    });
  }

  deleteGoal(id: number): Promise<Goal> {
    const goal = this.prismaService.goal.delete({
      where: {
        id,
      },
    });
    return goal;
  }
}
