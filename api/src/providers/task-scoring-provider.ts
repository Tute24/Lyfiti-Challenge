import { ScoreTaskDto } from '@/dtos/tasks/score-task-dto';
import { ChatCompletion } from 'openai/resources/chat/completions/completions';

export interface TaskScoringProvider {
  scoreTask(data: ScoreTaskDto): Promise<
    ChatCompletion & {
      _request_id?: string | null;
    } & { systemPrompt: string; model: string; userInput: string }
  >;
}
