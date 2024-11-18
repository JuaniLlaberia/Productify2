import { ConvexError, v } from 'convex/values';
import { omit } from 'convex-helpers';
import { paginationOptsValidator } from 'convex/server';

import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import { isAuth, isMember } from './auth';
import { Messages } from './schema';
import { Doc, Id } from './_generated/dataModel';

const populateThreads = async (ctx: QueryCtx, messageId: Id<'messages'>) => {
  const messages = await ctx.db
    .query('messages')
    .withIndex('by_parentId', q => q.eq('parentMessage', messageId))
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessage = messages.at(-1);
  const lastMessageMember = await populateMember(ctx, lastMessage!.memberId!); //FIX members ids and mix-up

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timestamp: 0,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessage!.userId);
  return {
    count: messages.length,
    image: lastMessageUser?.profileImage,
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

const populateMember = (ctx: QueryCtx, memberId: Id<'members'>) => {
  return ctx.db.get(memberId);
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
    const member = await isMember(ctx, teamId);

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
          .eq('parentMessage', parentMessageId)
          .eq('conversationId', _conversationId)
      )
      // .filter(q => q.eq(q.field('parentMessage'), undefined))
      .order('desc')
      .paginate(paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page
          .map(async message => {
            const user = member ? await populateUser(ctx, member._id) : null;

            if (!member || !user) return null;

            const reactions = await populateReactions(ctx, message._id);
            const reactionsWithCounts = reactions.map(reaction => {
              return {
                ...reaction,
                count: reactions.filter(r => r.value === reaction.value).length,
              };
            });
            const dedupedReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReactions = acc.find(
                  r => r.value === reaction.value
                );
                if (existingReactions) {
                  existingReactions.memberIds = Array.from(
                    new Set([...existingReactions.memberIds, reaction.memberId])
                  );
                } else {
                  acc.push({ ...reaction, memberIds: [reaction.memberId] });
                }

                return acc;
              },
              [] as (Doc<'reactions'> & {
                count: number;
                memberIds: Id<'members'>[];
              })[]
            );

            const reactionsWithoutMemberIdProp = dedupedReactions.map(
              ({ memberId, ...rest }) => rest
            );

            const thread = await populateThreads(ctx, message._id);
            const image = message.image
              ? await ctx.storage.getUrl(message.image)
              : undefined;

            return {
              ...message,
              image,
              member,
              reactions: reactionsWithoutMemberIdProp,
              threadCount: thread.count,
              threadImage: thread.image,
              threadTimestampt: thread.timestamp,
            };
          })
          .filter(message => message !== null)
      ),
    };
  },
});

export const createMessage = mutation({
  args: omit(Messages.withoutSystemFields, [
    'userId',
    'isEdited',
    'updatedAt',
    'memberId',
  ]),
  handler: async (ctx, args) => {
    const user = await isMember(ctx, args.teamId);

    let _conversationId = args.conversationId;
    //Replying in a thread in 1:1 channel (direct messages replies)
    if (!args.conversationId && !args.channelId && args.parentMessage) {
      const parentMessage = await ctx.db.get(args.parentMessage);

      if (!parentMessage) throw new ConvexError('Parent message not found');

      _conversationId = parentMessage.conversationId;
    }

    const messageId = await ctx.db.insert('messages', {
      ...args,
      conversationId: _conversationId,
      userId: user._id,
      isEdited: false,
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
        'parentMessage',
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
