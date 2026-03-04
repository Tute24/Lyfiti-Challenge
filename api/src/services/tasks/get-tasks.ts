import { TasksRepository } from '@/repositories/tasks-repository';
import { Task } from '@prisma/client';

export class GetTasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async execute(): Promise<Task[]> {
    const tasks = await this.tasksRepository.getTasks();
    return tasks;
  }
}
