import { omit } from 'convex-helpers';
import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { Reports } from './schema';
import { isMember } from './auth';
import { paginationOptsValidator } from 'convex/server';

export const getProjectReports = query({
  args: {
    teamId: v.id('teams'),
    projectId: v.id('projects'),
    filters: v.object({
      type: v.optional(Reports.withoutSystemFields.type),
      priority: v.optional(Reports.withoutSystemFields.priority),
    }),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const {
      teamId,
      projectId,
      filters: { type, priority },
      paginationOpts,
    } = args;
    await isMember(ctx, teamId);

    let query = ctx.db
      .query('reports')
      .withIndex('by_teamId_projectId', q =>
        q.eq('teamId', teamId).eq('projectId', projectId)
      );

    if (type) query = query.filter(q => q.eq(q.field('type'), type));
    if (priority)
      query = query.filter(q => q.eq(q.field('priority'), priority));

    const tasks = await query.order('desc').paginate(paginationOpts);
    return tasks;
  },
});

export const createReport = mutation({
  args: omit(Reports.withoutSystemFields, ['createdBy']),
  handler: async (ctx, args) => {
    const member = await isMember(ctx, args.teamId);
    if (!member) throw new ConvexError('You are not a member of this team');

    await ctx.db.insert('reports', {
      ...args,
      createdBy: member._id,
    });
  },
});

export const updateReport = mutation({
  args: {
    reportId: v.id('reports'),
    teamId: v.id('teams'),
    reportData: v.object(
      omit(Reports.withoutSystemFields, ['createdBy', 'teamId', 'projectId'])
    ),
  },
  handler: async (ctx, args) => {
    const { reportData, teamId, reportId } = args;
    await isMember(ctx, teamId);

    await ctx.db.patch(reportId, {
      ...reportData,
    });
  },
});

export const deleteReports = mutation({
  args: { reporstIds: v.array(v.id('reports')), teamId: v.id('teams') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    await Promise.all(args.reporstIds.map(reportId => ctx.db.delete(reportId)));
  },
});
