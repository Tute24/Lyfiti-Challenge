import { CreateTaskContractDto } from '@/dtos/tasks/create-task-dtos';
import { Task } from '@prisma/client';

export interface TasksRepository {
  createTask(data: CreateTaskContractDto): Promise<Task>;
}
