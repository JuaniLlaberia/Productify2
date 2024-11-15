import { v } from 'convex/values';
import { omit } from 'convex-helpers';

import { mutation, query } from './_generated/server';
import { isMember } from './auth';
import { SubTasks } from './schema';

export const getSubTasks = query({
  args: { teamId: v.id('teams'), parentTask: v.id('tasks') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const subTasks = await ctx.db
      .query('subTasks')
      .withIndex('by_parentId', q => q.eq('parentId', args.parentTask))
      .order('asc')
      .collect();

    return subTasks;
  },
});

export const createSubTask = mutation({
  args: SubTasks.withoutSystemFields,
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const taskId = await ctx.db.insert('subTasks', {
      ...args,
    });
    return taskId;
  },
});

export const updateSubTask = mutation({
  args: {
    teamId: v.id('teams'),
    subTaskId: v.id('subTasks'),
    subTaskData: v.object(
      omit(SubTasks.withoutSystemFields, ['teamId', 'projectId'])
    ),
  },
  handler: async (ctx, args) => {
    const { teamId, subTaskData, subTaskId } = args;
    await isMember(ctx, teamId);

    await ctx.db.patch(subTaskId, {
      ...subTaskData,
    });
  },
});

export const deleteSubTask = mutation({
  args: { teamId: v.id('teams'), subTaskId: v.id('subTasks') },
  handler: async (ctx, args) => {
    const { teamId, subTaskId } = args;
    await isMember(ctx, teamId);

    await ctx.db.delete(subTaskId);
  },
});
