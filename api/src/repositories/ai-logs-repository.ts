import { AiLog } from '@prisma/client';

export interface AiLogsRepository {
  getAiLogs(): Promise<AiLog[]>;
}
