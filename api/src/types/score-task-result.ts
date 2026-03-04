import { z } from 'zod';

export const taskScoreSchema = z.object({
  urgency_score: z.number().int().min(1).max(10),
  impact_score: z.number().int().min(1).max(10),
  priority_score: z.number().int().min(1).max(10),
  category: z.string().min(1),
  reasoning: z.string(),
});

export type TaskScore = z.infer<typeof taskScoreSchema>;
