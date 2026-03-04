import { z } from 'zod';

export const createAiLogSchema = z.object({
  taskId: z.string().optional(),
  model: z.string(),
  systemPrompt: z.string(),
  userInput: z.string(),
  rawResponse: z.string(),
  parsedResponse: z.record(z.string(), z.unknown()).optional(),
  status: z.string(),
});

export type CreateAiLogDto = z.infer<typeof createAiLogSchema>;
