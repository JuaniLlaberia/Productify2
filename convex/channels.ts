import { ConvexError, v } from 'convex/values';
import { omit } from 'convex-helpers';

import { mutation, query } from './_generated/server';
import { isAdmin, isMember } from './auth';
import { Channels } from './schema';

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
    const channelIds = channelMembers.map(
      channelMember => channelMember.channelId
    );
    const channels = await Promise.all(channelIds.map(id => ctx.db.get(id)));

    return channels;
  },
});

export const createChannel = mutation({
  args: {
    teamId: v.id('teams'),
    channelData: v.object(omit(Channels.withoutSystemFields, ['teamId'])),
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

    return channelId;
  },
});

export const updateChannel = mutation({
  args: {
    teamId: v.id('teams'),
    channelId: v.id('channels'),
    channelData: v.object(omit(Channels.withoutSystemFields, ['teamId'])),
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

export const leaveChannel = mutation({
  args: {
    teamId: v.id('teams'),
    channelId: v.id('channels'),
  },
  handler: async (ctx, args) => {
    const { teamId, channelId } = args;
    const member = await isMember(ctx, teamId);

    const channelMemberId = (
      await ctx.db
        .query('channelMembers')
        .withIndex('by_channelId_userId', q =>
          q.eq('channelId', channelId).eq('userId', member._id)
        )
        .first()
    )?._id;

    if (!channelMemberId)
      throw new ConvexError('You are not a member of this channel.');

    await ctx.db.delete(channelMemberId);
  },
});
