import { OpenAiTaskScoringProvider } from '@/providers/open-ai/open-ai-task-scoring-provider';
import { PrismaAiLogsRepository } from '@/repositories/prisma/prisma-ai-logs-repository';
import { PrismaTasksRepository } from '@/repositories/prisma/prisma-tasks-repository';
import { taskBodySchema } from '@/schemas/task-body-schema';
import { CreateTaskService } from '@/services/tasks/create-task';
import type { Request, Response } from 'express';

export async function createTaskController(req: Request, res: Response) {
  const { description, title } = taskBodySchema.parse(req.body);

  const tasksRepository = new PrismaTasksRepository();
  const aiLogsRepository = new PrismaAiLogsRepository();
  const taskScoringProvider = new OpenAiTaskScoringProvider();

  const createTaskService = new CreateTaskService(
    tasksRepository,
    aiLogsRepository,
    taskScoringProvider,
  );

  await createTaskService.execute({ title, description });
  res.status(201).json({ message: 'Task created successfully!' });
}
