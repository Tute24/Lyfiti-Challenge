import { z } from 'zod';

export const taskBodySchema = z.object({
  title: z.string(),
  description: z.string(),
});
// Por mais que taskBodySchema e scoreTaskSchema sejam iguais, eles tem propósitos diferentes. O taskBodySchema é para a criação de tarefas, enquanto o scoreTaskSchema é para a avaliação de tarefas. Manter os dois separados ajuda a manter a clareza e a organização do código, e pensando em adições de propriedades futuras nos schemas.
