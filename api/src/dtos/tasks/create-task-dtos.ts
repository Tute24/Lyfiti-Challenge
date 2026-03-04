import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  urgencyScore: z.number().int(),
  impactScore: z.number().int(),
  priorityScore: z.number().int(),
  category: z.string(),
  reasoning: z.string(),
});

export type CreateTaskContractDto = z.infer<typeof createTaskSchema>;
