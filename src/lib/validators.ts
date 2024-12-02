import { z } from 'zod';
import { PriorityEnum, ReportTypeEnum, StatusEnum } from './enums';

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
  private: z.boolean(),
  icon: z.string().optional(),
});

export const ChannelSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(25, 'Must be less than 25 characters.'),
  private: z.boolean(),
  icon: z.string(),
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

export const ReportSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(25, 'Must be less than 25 characters'),
  description: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(250, 'Must be less than 250 characters'),
  priority: z.nativeEnum(PriorityEnum).optional(),
  type: z.nativeEnum(ReportTypeEnum).optional(),
});

export const TaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(25, 'Must be less than 25 characters'),
  description: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(250, 'Must be less than 250 characters')
    .optional(),
  priority: z.nativeEnum(PriorityEnum).optional(),
  status: z.nativeEnum(StatusEnum).optional(),
  date: z.date().optional(),
  label: z.string().optional(),
  assignee: z.string().optional(),
});

export const TemplatesSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Must be at least 1 character.' })
    .max(25, 'Must be less than 25 characters'),
  description: z
    .string()
    .max(250, 'Must be less than 250 characters')
    .optional(),
  priority: z.nativeEnum(PriorityEnum).optional(),
  status: z.nativeEnum(StatusEnum).optional(),
  label: z.string().optional(),
  assignee: z.string().optional(),
});

export const ConversationSchema = z.object({
  memberId: z.string().min(1, { message: 'Please select a member' }),
});
