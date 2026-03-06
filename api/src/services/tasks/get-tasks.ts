import { TasksRepository, TaskSummary } from '@/repositories/tasks-repository';

export class GetTasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async execute(): Promise<TaskSummary[]> {
    const tasks = await this.tasksRepository.getTasks();
    return tasks;
  }
}
