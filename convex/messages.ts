import { ConvexError, v } from 'convex/values';
import { omit } from 'convex-helpers';
import { paginationOptsValidator } from 'convex/server';

import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import { isAuth, isMember } from './helpers';
import { Messages } from './schema';
import { Doc, Id } from './_generated/dataModel';

const populateThreads = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const messages = await ctx.db
    .query('messages')
    .withIndex('by_parentId', q => q.eq('parentMessageId', messageId))
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessage = messages.at(-1);
  const lastMessageUser = await populateUser(ctx, lastMessage!.userId);
  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timestampt: lastMessage?._creationTime,
  };
};

const populateReactions = (ctx: QueryCtx, messageId: Id<'messages'>) => {
  return ctx.db
    .query('reactions')
    .withIndex('by_messageId', q => q.eq('messageId', messageId))
    .collect();
};

const populateUser = (ctx: QueryCtx, userId: Id<'users'>) => {
  return ctx.db.get(userId);
};

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

type ReactionWithCount = Doc<'reactions'> & {
  count: number;
  userIds: Id<'users'>[];
};

type DedupedReaction = Omit<ReactionWithCount, 'userId'>;

export const getMessages = query({
  args: {
    teamId: v.id('teams'),
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
    parentMessageId: v.optional(v.id('messages')),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const {
      teamId,
      channelId,
      conversationId,
      parentMessageId,
      paginationOpts,
    } = args;
    const user = await isMember(ctx, teamId);

    // 1:1 conversation threads
    let _conversationId = conversationId;
    if (!conversationId && !channelId && parentMessageId) {
      const parentMessage = await ctx.db.get(parentMessageId);

      if (!parentMessage) throw new ConvexError('Parent message not found');

      _conversationId = parentMessage.conversationId;
    }

    const results = await ctx.db
      .query('messages')
      .withIndex('by_channelId_parentId_conversationId', q =>
        q
          .eq('channelId', channelId)
          .eq('parentMessageId', parentMessageId)
          .eq('conversationId', _conversationId)
      )
      .order('desc')
      .paginate(paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page
          .map(async message => {
            if (!user) return null;

            const reactions = await populateReactions(ctx, message._id);
            const reactionsWithCounts = reactions.map(reaction => {
              return {
                ...reaction,
                count: reactions.filter(r => r.value === reaction.value).length,
              };
            });

            const dedupedReactions = reactionsWithCounts.reduce<
              DedupedReaction[]
            >((acc, reaction) => {
              const existingReactions = acc.find(
                r => r.value === reaction.value
              );
              if (existingReactions) {
                existingReactions.userIds = Array.from(
                  new Set([...existingReactions.userIds, reaction.userId])
                );
              } else {
                // Explicitly construct the deduped reaction object
                const { userId, ...restReaction } = reaction;
                acc.push({
                  ...restReaction,
                  userIds: [userId],
                });
              }

              return acc;
            }, []);

            const thread = await populateThreads(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            return {
              ...message,
              image,
              user,
              reactions: dedupedReactions,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestampt: thread.timestampt,
            };
          })
          .filter(message => message !== null)
      ),
    };
  },
});

export const getThreads = query({
  args: {
    teamId: v.id('teams'),
    threadsOnly: v.optional(v.boolean()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { teamId, threadsOnly, paginationOpts } = args;
    const user = await isMember(ctx, teamId);
    if (!user) throw new ConvexError('You are not a member of this team');

    const results = await ctx.db
      .query('messages')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', teamId).eq('userId', user._id)
      )
      .filter(q => q.eq(q.field('hasThread'), threadsOnly))
      .order('desc')
      .paginate(paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page
          .map(async message => {
            if (!user) return null;

            const reactions = await populateReactions(ctx, message._id);
            const reactionsWithCounts = reactions.map(reaction => {
              return {
                ...reaction,
                count: reactions.filter(r => r.value === reaction.value).length,
              };
            });

            const dedupedReactions = reactionsWithCounts.reduce<
              DedupedReaction[]
            >((acc, reaction) => {
              const existingReactions = acc.find(
                r => r.value === reaction.value
              );
              if (existingReactions) {
                existingReactions.userIds = Array.from(
                  new Set([...existingReactions.userIds, reaction.userId])
                );
              } else {
                // Explicitly construct the deduped reaction object
                const { userId, ...restReaction } = reaction;
                acc.push({
                  ...restReaction,
                  userIds: [userId],
                });
              }

              return acc;
            }, []);

            const thread = await populateThreads(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            return {
              ...message,
              image,
              user,
              reactions: dedupedReactions,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestampt: thread.timestampt,
            };
          })
          .filter(message => message !== null)
      ),
    };
  },
});

export const getMessageById = query({
  args: { teamId: v.id('teams'), messageId: v.id('messages') },
  handler: async (ctx, args) => {
    const { messageId, teamId } = args;
    const member = await isMember(ctx, teamId);

    const message = await ctx.db.get(messageId);
    if (!message) return null;

    const reactions = await populateReactions(ctx, message._id);

    const reactionsWithCounts = reactions.map(reaction => {
      return {
        ...reaction,
        count: reactions.filter(r => r.value === reaction.value).length,
      };
    });
    const dedupedReactions = reactionsWithCounts.reduce<DedupedReaction[]>(
      (acc, reaction) => {
        const existingReactions = acc.find(r => r.value === reaction.value);
        if (existingReactions) {
          existingReactions.userIds = Array.from(
            new Set([...existingReactions.userIds, reaction.userId])
          );
        } else {
          // Explicitly construct the deduped reaction object
          const { userId, ...restReaction } = reaction;
          acc.push({
            ...restReaction,
            userIds: [userId],
          });
        }

        return acc;
      },
      []
    );

    return {
      ...message,
      image: message.image
        ? await ctx.storage.getUrl(message.image)
        : undefined,
      user: member,
      reactions: dedupedReactions,
    };
  },
});

export const createMessage = mutation({
  args: omit(Messages.withoutSystemFields, ['userId', 'isEdited', 'updatedAt']),
  handler: async (ctx, args) => {
    const { conversationId, channelId, parentMessageId, teamId } = args;
    const user = await isMember(ctx, teamId);
    if (!user) throw new ConvexError('You are not a member of this team');

    let _conversationId = conversationId;
    //Replying in a thread in 1:1 channel (direct messages replies)
    if (!conversationId && !channelId && parentMessageId) {
      const parentMessageData = await ctx.db.get(parentMessageId);

      if (!parentMessageData) throw new ConvexError('Parent message not found');

      _conversationId = parentMessageData.conversationId;
    }

    if (parentMessageId) {
      const parentMessage = await ctx.db.get(parentMessageId);
      if (!parentMessage) throw new ConvexError('Parent message not found');

      if (!parentMessage?.hasThread)
        await ctx.db.patch(parentMessage?._id, { hasThread: true });
    }

    const messageId = await ctx.db.insert('messages', {
      ...args,
      conversationId: _conversationId,
      userId: user._id,
      isEdited: false,
      hasThread: false,
    });

    return messageId;
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id('messages'),
    teamId: v.id('teams'),
    messageData: v.object(
      omit(Messages.withoutSystemFields, [
        'userId',
        'channelId',
        'teamId',
        'isEdited',
        'parentMessageId',
        'image',
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
      updatedAt: Date.now(),
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
