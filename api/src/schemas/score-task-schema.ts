import { z } from 'zod';

export const scoreTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
});
