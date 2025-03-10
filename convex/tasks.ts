import { omit } from 'convex-helpers';
import { ConvexError, v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';

import { mutation, query } from './_generated/server';
import { Tasks } from './schema';
import { isMember } from './helpers';

export const getProjectTasks = query({
  args: {
    teamId: v.id('teams'),
    projectId: v.id('projects'),
    filters: v.object({
      status: v.optional(Tasks.withoutSystemFields.status),
      priority: v.optional(Tasks.withoutSystemFields.priority),
      label: v.optional(Tasks.withoutSystemFields.label),
    }),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const {
      teamId,
      projectId,
      filters: { status, priority, label },
      paginationOpts,
    } = args;
    await isMember(ctx, teamId);

    let query = ctx.db
      .query('tasks')
      .withIndex('by_teamId_projectId', q =>
        q.eq('teamId', teamId).eq('projectId', projectId)
      );

    if (status) query = query.filter(q => q.eq(q.field('status'), status));
    if (priority)
      query = query.filter(q => q.eq(q.field('priority'), priority));
    if (label) query = query.filter(q => q.eq(q.field('label'), label));

    const paginatedResult = await query.order('desc').paginate(paginationOpts);

    const tasksWithDetails = await Promise.all(
      paginatedResult.page.map(async task => ({
        ...task,
        assignee: task.assignee ? await ctx.db.get(task.assignee) : null,
        label: task.label ? await ctx.db.get(task.label) : null,
      }))
    );

    return {
      ...paginatedResult,
      page: tasksWithDetails,
    };
  },
});

export const getUserTasksInTeam = query({
  args: {
    teamId: v.id('teams'),
    filters: v.object({
      status: v.optional(Tasks.withoutSystemFields.status),
      priority: v.optional(Tasks.withoutSystemFields.priority),
    }),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const {
      teamId,
      filters: { status, priority },
      paginationOpts,
    } = args;
    const member = await isMember(ctx, teamId);
    if (!member) throw new ConvexError('You are not a member of this team');

    let query = ctx.db
      .query('tasks')
      .withIndex('by_teamId_assignee', q =>
        q.eq('teamId', args.teamId).eq('assignee', member._id)
      );

    if (status) query = query.filter(q => q.eq(q.field('status'), status));
    if (priority)
      query = query.filter(q => q.eq(q.field('priority'), priority));

    const paginatedResult = await query.order('desc').paginate(paginationOpts);

    const tasksWithDetails = await Promise.all(
      paginatedResult.page.map(async task => ({
        ...task,
        assignee: task.assignee ? await ctx.db.get(task.assignee) : null,
        label: task.label ? await ctx.db.get(task.label) : null,
      }))
    );

    return {
      ...paginatedResult,
      page: tasksWithDetails,
    };
  },
});

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
      omit(Tasks.withoutSystemFields, ['teamId', 'projectId'])
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

export const deleteTasks = mutation({
  args: { teamId: v.id('teams'), taskIds: v.array(v.id('tasks')) },
  handler: async (ctx, args) => {
    const { teamId, taskIds } = args;
    await isMember(ctx, teamId);

    await Promise.all(taskIds.map(taskId => ctx.db.delete(taskId)));
  },
});
