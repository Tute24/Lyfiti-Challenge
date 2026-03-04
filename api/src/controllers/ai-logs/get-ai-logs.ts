import { PrismaAiLogsRepository } from '@/repositories/prisma/prisma-ai-logs-repository';
import { GetAiLogsService } from '@/services/ai-logs/get-ai-logs';
import type { Request, Response } from 'express';

export async function getAiLogsController(req: Request, res: Response) {
  const aiLogsRepository = new PrismaAiLogsRepository();

  const getAiLogsService = new GetAiLogsService(aiLogsRepository);

  const aiLogs = await getAiLogsService.execute();
  res.status(200).json({ aiLogs });
}
