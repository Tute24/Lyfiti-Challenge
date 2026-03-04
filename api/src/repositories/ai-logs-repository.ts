import { AiLog } from '@prisma/client';
import { CreateAiLogDto } from '@/dtos/ai-logs/create-ai-log-dto';

export interface AiLogsRepository {
  getAiLogs(): Promise<AiLog[]>;
  createAiLog(data: CreateAiLogDto): Promise<AiLog>;
}
