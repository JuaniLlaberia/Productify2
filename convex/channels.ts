import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { isAdmin, isMember } from './auth';

export const getChannels = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const member = await isMember(ctx, args.teamId);

    const channelMembers = await ctx.db
      .query('channelMembers')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', args.teamId).eq('userId', member._id)
      )
      .collect();
    const channelIds = channelMembers.map(channelMember => channelMember._id);
    const channels = await Promise.all(channelIds.map(id => ctx.db.get(id)));

    return channels;
  },
});

export const createChannel = mutation({
  args: {
    teamId: v.id('teams'),
    channelData: v.object({
      name: v.string(),
      icon: v.string(),
      allowsWritting: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const { teamId, channelData } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    const channelId = await ctx.db.insert('channels', {
      ...channelData,
      teamId,
    });

    await ctx.db.insert('channelMembers', {
      userId: user._id,
      teamId,
      channelId,
    });
  },
});

export const updateChannel = mutation({
  args: {
    teamId: v.id('teams'),
    channelId: v.id('channels'),
    channelData: v.object({
      name: v.string(),
      icon: v.string(),
      allowsWritting: v.boolean(),
    }),
  },
  handler: async (ctx, args) => {
    const { teamId, channelData, channelId } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.patch(channelId, {
      ...channelData,
    });
  },
});

export const deleteChannel = mutation({
  args: { channelId: v.id('channels'), teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const user = await isAdmin(ctx, args.teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.delete(args.channelId);

    //Implement cascading for tasks and all related elements or manually?
  },
});

export const createChannelMember = mutation({
  args: {
    channelId: v.id('channels'),
    userId: v.id('users'),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const user = await isAdmin(ctx, args.teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.insert('channelMembers', {
      ...args,
    });
  },
});

export const removeProjectMember = mutation({
  args: {
    channelMember: v.id('channelMembers'),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const user = await isAdmin(ctx, args.teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.delete(args.channelMember);
  },
});
