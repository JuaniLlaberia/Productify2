import { z } from 'zod';

export const newTeamSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(30, 'Must be less than 30 characters'),
});
