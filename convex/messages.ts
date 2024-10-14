import { ConvexError, v } from 'convex/values';
import { omit } from 'convex-helpers';

import { mutation, MutationCtx, QueryCtx } from './_generated/server';
import { isAuth, isMember } from './auth';
import { Messages } from './schema';
import { Id } from './_generated/dataModel';

const messageBelongsToUser = async (
  ctx: QueryCtx | MutationCtx,
  messageId: Id<'messages'>
) => {
  const user = await isAuth(ctx);
  if (!user) throw new ConvexError('Must be logged in.');

  const message = await ctx.db
    .query('messages')
    .withIndex('by_id', q => q.eq('_id', messageId))
    .first();
  if (!message) throw new ConvexError('Message does not exist.');
  if (message?.userId !== user._id)
    throw new ConvexError('This message does not belong to this user.');
  else return true;
};

export const createMessage = mutation({
  args: omit(Messages.withoutSystemFields, ['userId']),
  handler: async (ctx, args) => {
    const user = await isMember(ctx, args.teamId);

    await ctx.db.insert('messages', {
      ...args,
      userId: user._id,
    });
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id('messages'),
    teamId: v.id('teams'),
    messageData: v.object(
      omit(Messages.withoutSystemFields, [
        'userId',
        'type',
        'channelId',
        'teamId',
        'type',
        'isEdited',
        'parentMessage',
      ])
    ),
  },
  handler: async (ctx, args) => {
    const { messageData, messageId, teamId } = args;
    //Check if user is member and if message belongs to user
    await Promise.all([
      isMember(ctx, teamId),
      messageBelongsToUser(ctx, messageId),
    ]);

    await ctx.db.patch(messageId, {
      ...messageData,
      isEdited: true,
    });
  },
});

export const deleteMessage = mutation({
  args: { teamId: v.id('teams'), messageId: v.id('messages') },
  handler: async (ctx, args) => {
    //Check if user is member and if message belongs to user
    await Promise.all([
      isMember(ctx, args.teamId),
      messageBelongsToUser(ctx, args.messageId),
    ]);

    await ctx.db.delete(args.messageId);
  },
});
