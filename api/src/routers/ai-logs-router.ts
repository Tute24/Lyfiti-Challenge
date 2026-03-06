import { getAiLogsController } from '@/controllers/ai-logs/get-ai-logs';
import { asyncHandler } from '@/utils/async-handler';
import express, { type Router } from 'express';

export const aiLogsRouter: Router = express.Router();

aiLogsRouter.get('/', asyncHandler(getAiLogsController));
