import { PrismaTasksRepository } from '@/repositories/prisma/prisma-tasks-repository';
import { GetTasksService } from '@/services/tasks/get-tasks';
import type { Request, Response } from 'express';

export async function getTasksController(req: Request, res: Response) {
  const tasksRepository = new PrismaTasksRepository();

  const getTasksService = new GetTasksService(tasksRepository);

  const tasks = await getTasksService.execute();
  res.status(200).json({ tasks });
}
