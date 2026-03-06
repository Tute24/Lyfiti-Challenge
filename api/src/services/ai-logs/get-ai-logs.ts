import { AiLogsRepository } from '@/repositories/ai-logs-repository';
import { AiLog } from '@prisma/client';

export class GetAiLogsService {
  constructor(private aiLogsRepository: AiLogsRepository) {}

  async execute(): Promise<AiLog[]> {
    const aiLogs = await this.aiLogsRepository.getAiLogs();
    return aiLogs;
  }
}
