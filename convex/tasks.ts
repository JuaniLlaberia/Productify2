import { omit } from 'convex-helpers';
import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { Tasks } from './schema';
import { isMember } from './auth';

export const createTask = mutation({
  args: Tasks.withoutSystemFields,
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const taskId = await ctx.db.insert('tasks', {
      ...args,
    });
    return taskId;
  },
});

export const updateTask = mutation({
  args: {
    teamId: v.id('teams'),
    taskId: v.id('tasks'),
    taskData: v.object(
      omit(Tasks.withoutSystemFields, [
        'parentTask',
        'teamId',
        'projectId',
        'isSubTask',
      ])
    ),
  },
  handler: async (ctx, args) => {
    const { teamId, taskData, taskId } = args;
    await isMember(ctx, teamId);

    await ctx.db.patch(taskId, {
      ...taskData,
    });
  },
});

export const deleteTask = mutation({
  args: { teamId: v.id('teams'), taskId: v.id('tasks') },
  handler: async (ctx, args) => {
    const { teamId, taskId } = args;
    await isMember(ctx, teamId);

    await ctx.db.delete(taskId);
  },
});
