import { scoreTaskSchema } from '@/schemas/score-task-schema';
import { z } from 'zod';

export type ScoreTaskDto = z.infer<typeof scoreTaskSchema>;
