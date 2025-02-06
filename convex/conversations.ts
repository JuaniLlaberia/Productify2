import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { isMember } from './helpers';

export const getConversations = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const { teamId } = args;
    const user = await isMember(ctx, teamId);
    if (!user) throw new ConvexError('You are not a member of this team');

    const conversations = await ctx.db
      .query('conversations')
      .filter(
        q =>
          q.eq(q.field('userOneId'), user._id) ||
          q.eq(q.field('userTwoId'), user._id)
      )
      .order('desc')
      .collect();

    const conversationsWithOtherUser = await Promise.all(
      conversations.map(async conversation => {
        const otherUserId =
          conversation.userOneId === user._id
            ? conversation.userTwoId
            : conversation.userOneId;

        const otherUser = await ctx.db.get(otherUserId);

        return {
          conversationId: conversation._id,
          otherUser,
        };
      })
    );

    return conversationsWithOtherUser;
  },
});

export const getConversationById = query({
  args: { teamId: v.id('teams'), conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const { teamId, conversationId } = args;
    const user = await isMember(ctx, teamId);

    const conversation = await ctx.db.get(conversationId);
    if (!conversation) throw new ConvexError('Conversation not found');
    if (
      user?._id !== conversation.userOneId &&
      user?._id !== conversation.userTwoId
    )
      throw new ConvexError(
        'This is not your conversation. You can not access it.'
      );

    const otherUserId =
      conversation.userOneId === user._id
        ? conversation.userTwoId
        : conversation.userOneId;

    const otherUser = await ctx.db.get(otherUserId);
    return {
      conversationId: conversation._id,
      otherUser,
      _creationTime: conversation._creationTime,
    };
  },
});

export const createConversation = mutation({
  args: {
    teamId: v.id('teams'),
    otherUserId: v.id('users'),
  },
  handler: async (ctx, args) => {
    const { teamId, otherUserId } = args;
    const user = await isMember(ctx, teamId);
    if (!user) throw new ConvexError('You are not a member of this team');

    const userPair = [user._id, otherUserId].sort().join('|');

    const existingConversation = await ctx.db
      .query('conversations')
      .withIndex('by_team_users_unique', q =>
        q.eq('teamId', teamId).eq('userPair', userPair)
      )
      .unique();

    if (existingConversation !== null)
      throw new ConvexError(
        'A conversation between these users already exists in this team'
      );

    const conversationId = await ctx.db.insert('conversations', {
      teamId,
      userOneId: user._id,
      userTwoId: otherUserId,
      userPair,
    });

    return conversationId;
  },
});

export const deleteConversation = mutation({
  args: { teamId: v.id('teams'), conversationId: v.id('conversations') },
  handler: async (ctx, args) => {
    const { teamId, conversationId } = args;
    const user = await isMember(ctx, teamId);

    const conversation = await ctx.db.get(conversationId);
    if (!conversation) throw new ConvexError('Conversation not found');

    if (
      user?._id !== conversation.userOneId &&
      user?._id !== conversation.userTwoId
    )
      throw new ConvexError(
        'This is not your conversation. You are not allow to delete it.'
      );

    await ctx.db.delete(conversation._id);
  },
});
