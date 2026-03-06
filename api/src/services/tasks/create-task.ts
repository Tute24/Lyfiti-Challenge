import { CreateTaskServiceDto } from '@/dtos/tasks/create-task-dtos';
import { TaskScoringProvider } from '@/providers/task-scoring-provider';
import { AiLogsRepository } from '@/repositories/ai-logs-repository';
import { TasksRepository } from '@/repositories/tasks-repository';
import { taskScoreSchema } from '@/types/score-task-result';
import { AppError } from '@/utils/app-error';
import { Task } from '@prisma/client';

export class CreateTaskService {
  constructor(
    private tasksRepository: TasksRepository,
    private aiLogsRepository: AiLogsRepository,
    private taskScoringProvider: TaskScoringProvider,
  ) {}

  async execute(data: CreateTaskServiceDto): Promise<Task> {
    const { choices, model, systemPrompt, userInput } =
      await this.taskScoringProvider.scoreTask({
        title: data.title,
        description: data.description,
      });

    const rawResponse = choices[0].message.content;

    if (!rawResponse) {
      await this.aiLogsRepository.createAiLog({
        model,
        systemPrompt,
        userInput,
        rawResponse: '',
        status: 'EMPTY_RESPONSE',
      });
      throw new AppError('Empty LLM response', 500);
    }

    const parsed = taskScoreSchema.safeParse(JSON.parse(rawResponse));

    if (!parsed.success) {
      await this.aiLogsRepository.createAiLog({
        model,
        systemPrompt,
        userInput,
        rawResponse,
        status: 'INVALID_FORMAT',
      });
      throw new AppError('Invalid LLM response format', 500);
    }

    const { urgency_score, impact_score, priority_score, category, reasoning } =
      parsed.data;

    let task;

    try {
      task = await this.tasksRepository.createTask({
        title: data.title,
        description: data.description,
        urgencyScore: urgency_score,
        impactScore: impact_score,
        priorityScore: priority_score,
        category,
        reasoning,
      });
    } catch (err) {
      await this.aiLogsRepository.createAiLog({
        model,
        systemPrompt,
        userInput,
        rawResponse,
        parsedResponse: parsed.data,
        status: 'API_ERROR',
      });
      throw err;
    }

    await this.aiLogsRepository.createAiLog({
      taskId: task.id,
      model,
      systemPrompt,
      userInput,
      rawResponse,
      parsedResponse: parsed.data,
      status: 'SUCCESS',
    });

    return task;
  }
}
