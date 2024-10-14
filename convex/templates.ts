import { omit } from 'convex-helpers';
import { v } from 'convex/values';

import { mutation } from './_generated/server';
import { Templates } from './schema';
import { isMember } from './auth';

export const createTemplate = mutation({
  args: Templates.withoutSystemFields,
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    await ctx.db.insert('templates', {
      ...args,
    });
  },
});

export const updateTemplate = mutation({
  args: {
    teamId: v.id('teams'),
    templateId: v.id('templates'),
    templateData: v.object(omit(Templates.withoutSystemFields, ['teamId'])),
  },
  handler: async (ctx, args) => {
    const { teamId, templateData, templateId } = args;
    await isMember(ctx, teamId);

    await ctx.db.patch(templateId, {
      ...templateData,
    });
  },
});

export const deleteTemplate = mutation({
  args: { teamId: v.id('teams'), teamplateId: v.id('templates') },
  handler: async (ctx, args) => {
    const { teamId, teamplateId } = args;
    await isMember(ctx, teamId);

    await ctx.db.delete(teamplateId);
  },
});
