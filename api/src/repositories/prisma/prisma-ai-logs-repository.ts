import prisma from '@/lib/prisma';
import { AiLogsRepository } from '../ai-logs-repository';

export class PrismaAiLogsRepository implements AiLogsRepository {
  async getAiLogs() {
    const aiLogs = await prisma.aiLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return aiLogs;
  }
}
