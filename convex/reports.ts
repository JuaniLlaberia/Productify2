import { omit } from 'convex-helpers';
import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { Reports } from './schema';
import { isMember } from './auth';

export const createReport = mutation({
  args: omit(Reports.withoutSystemFields, ['createdBy']),
  handler: async (ctx, args) => {
    const member = await isMember(ctx, args.teamId);

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
      omit(Reports.withoutSystemFields, ['createdBy', 'teamId'])
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

export const deleteReport = mutation({
  args: { reportId: v.id('reports'), teamId: v.id('teams') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);
    await ctx.db.delete(args.reportId);
  },
});
