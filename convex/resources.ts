import { omit } from 'convex-helpers';
import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { Resources } from './schema';
import { isMember } from './auth';

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
