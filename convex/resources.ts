import { omit } from 'convex-helpers';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { Resources } from './schema';
import { isMember } from './auth';

export const getResources = query({
  args: {
    teamId: v.id('teams'),
    filters: v.object({
      category: Resources.withoutSystemFields.category,
    }),
  },
  handler: async (ctx, args) => {
    const {
      teamId,
      filters: { category },
    } = args;
    await isMember(ctx, teamId);

    let query = ctx.db
      .query('resources')
      .withIndex('by_teamId', q => q.eq('teamId', teamId));
    if (category)
      query = query.filter(q => q.eq(q.field('category'), category));

    const resources = await query.collect();
    return resources;
  },
});

export const createResource = mutation({
  args: Resources.withoutSystemFields,
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    await ctx.db.insert('resources', {
      ...args,
    });
  },
});

export const updateResource = mutation({
  args: {
    teamId: v.id('teams'),
    resourceId: v.id('resources'),
    resourceData: v.object(omit(Resources.withoutSystemFields, ['teamId'])),
  },
  handler: async (ctx, args) => {
    const { teamId, resourceData, resourceId } = args;
    await isMember(ctx, teamId);

    await ctx.db.patch(resourceId, {
      ...resourceData,
    });
  },
});

export const deleteResource = mutation({
  args: { teamId: v.id('teams'), resourceId: v.id('resources') },
  handler: async (ctx, args) => {
    const { teamId, resourceId } = args;
    await isMember(ctx, teamId);

    await ctx.db.delete(resourceId);
  },
});
