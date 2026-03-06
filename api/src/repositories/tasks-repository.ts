import { CreateTaskContractDto } from '@/dtos/tasks/create-task-dtos';
import { Task } from '@prisma/client';

export type TaskSummary = Omit<Task, 'reasoning' | 'updatedAt'>;

export interface TasksRepository {
  createTask(data: CreateTaskContractDto): Promise<Task>;
  getTasks(): Promise<TaskSummary[]>;
}
