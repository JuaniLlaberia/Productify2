import { omit } from 'convex-helpers';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { Labels } from './schema';
import { isMember } from './auth';

export const getLabels = query({
  args: { teamId: v.id('teams'), projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const labels = await ctx.db
      .query('labels')
      .withIndex('by_teamId_projectId', q =>
        q.eq('teamId', args.teamId).eq('projectId', args.projectId)
      )
      .order('desc')
      .collect();
    return labels;
  },
});

export const createLabel = mutation({
  args: omit(Labels.withoutSystemFields, ['createdBy']),
  handler: async (ctx, args) => {
    const member = await isMember(ctx, args.teamId);

    await ctx.db.insert('labels', {
      ...args,
      createdBy: member._id,
    });
  },
});

export const updateLabel = mutation({
  args: {
    labelId: v.id('labels'),
    teamId: v.id('teams'),
    labelData: v.object(
      omit(Labels.withoutSystemFields, ['createdBy', 'teamId', 'projectId'])
    ),
  },
  handler: async (ctx, args) => {
    const { labelData, teamId, labelId } = args;
    await isMember(ctx, teamId);

    await ctx.db.patch(labelId, {
      ...labelData,
    });
  },
});

export const deleteLabel = mutation({
  args: { labelId: v.id('labels'), teamId: v.id('teams') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);
    await ctx.db.delete(args.labelId);
  },
});
