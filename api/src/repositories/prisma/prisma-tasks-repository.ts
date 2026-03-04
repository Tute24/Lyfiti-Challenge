import { CreateTaskContractDto } from '@/dtos/tasks/create-task-dtos';
import { TasksRepository } from '../tasks-repository';
import prisma from '@/lib/prisma';

export class PrismaTasksRepository implements TasksRepository {
  async createTask(data: CreateTaskContractDto) {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        urgencyScore: data.urgencyScore,
        impactScore: data.impactScore,
        priorityScore: data.priorityScore,
        category: data.category,
        reasoning: data.reasoning,
      },
    });

    return task;
  }
  async getTasks() {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tasks;
  }
}
