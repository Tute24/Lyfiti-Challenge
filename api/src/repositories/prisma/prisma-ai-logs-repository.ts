import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { AiLogsRepository } from '../ai-logs-repository';
import { CreateAiLogDto } from '@/dtos/ai-logs/create-ai-log-dto';

export class PrismaAiLogsRepository implements AiLogsRepository {
  async getAiLogs() {
    const aiLogs = await prisma.aiLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return aiLogs;
  }

  async createAiLog(data: CreateAiLogDto) {
    const aiLog = await prisma.aiLog.create({
      data: {
        taskId: data.taskId,
        model: data.model,
        systemPrompt: data.systemPrompt,
        userInput: data.userInput,
        rawResponse: data.rawResponse,
        parsedResponse: data.parsedResponse as
          | Prisma.InputJsonValue
          | undefined,
        status: data.status,
      },
    });
    return aiLog;
  }
}
