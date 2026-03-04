import { createTaskSchema } from '@/schemas/create-task-schema';
import z from 'zod';

export type CreateTaskDto = z.infer<typeof createTaskSchema>;
