import { z } from 'zod';

export const newTeamSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(30, 'Must be less than 30 characters.'),
});

export const ProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(25, 'Must be less than 25 characters.'),
  public: z.boolean(),
  autojoin: z.boolean(),
});

export const ChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(25, 'Must be less than 25 characters.'),
  public: z.boolean(),
});

export const LabelSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(25, 'Must be less than 25 characters'),
  color: z.object({
    label: z.string(),
    value: z.string(),
  }),
});
