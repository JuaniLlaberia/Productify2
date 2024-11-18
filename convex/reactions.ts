import { ConvexError, v } from 'convex/values';

import { mutation } from './_generated/server';
import { isMember } from './auth';

export const toggle = mutation({
  args: {
    teamId: v.id('teams'),
    messageId: v.id('messages'),
    value: v.string(),
  },
  handler: async (ctx, args) => {
    const { teamId, messageId, value } = args;
    const { _id: userId } = await isMember(ctx, teamId);

    const message = await ctx.db.get(messageId);
    if (!message) throw new ConvexError('Message not found');

    const existingMessageReactionFromUser = await ctx.db
      .query('reactions')
      .filter(q =>
        q.and(
          q.eq(q.field('messageId'), messageId),
          q.eq(q.field('userId'), userId),
          q.eq(q.field('value'), value)
        )
      )
      .first();

    if (existingMessageReactionFromUser) {
      await ctx.db.delete(existingMessageReactionFromUser._id);
    } else {
      await ctx.db.insert('reactions', {
        teamId,
        userId,
        value,
        messageId: messageId,
      });
    }
  },
});
