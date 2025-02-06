import { ConvexError, v } from 'convex/values';

import {
  internalMutation,
  mutation,
  MutationCtx,
  query,
} from './_generated/server';
import { isAuth, isMember } from './helpers';

export const getTeamCode = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const teamCode = await ctx.db
      .query('inviteCodes')
      .withIndex('by_teamId', q => q.eq('teamId', args.teamId))
      .unique();
    if (!teamCode) return null;

    return teamCode;
  },
});

export const updateTeamCode = mutation({
  args: {
    teamId: v.id('teams'),
    teamCodeId: v.id('inviteCodes'),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { teamId, teamCodeId, isActive } = args;
    const member = await isMember(ctx, teamId);
    if (!member) throw new ConvexError('You are not a member of this team');

    if (member.role === 'member')
      throw new ConvexError('You are not allow to perform this action');

    await ctx.db.patch(teamCodeId, { isActive });
  },
});

async function generateUniqueToken(ctx: MutationCtx): Promise<string> {
  const randomBytes = new Uint8Array(10);
  crypto.getRandomValues(randomBytes);
  const token = Array.from(randomBytes, byte =>
    byte.toString(16).padStart(2, '0')
  ).join('');

  // Check if token already exists
  const existingCode = await ctx.db
    .query('inviteCodes')
    .withIndex('by_token', q => q.eq('token', token))
    .unique();

  if (existingCode) {
    return generateUniqueToken(ctx);
  }

  return token;
}

export const generateCode = internalMutation({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const { teamId } = args;
    const token = await generateUniqueToken(ctx);

    await ctx.db.insert('inviteCodes', {
      teamId,
      token,
      isActive: true,
    });
  },
});

export const joinTeamWithCode = mutation({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const { token } = args;

    const user = await isAuth(ctx);
    if (!user) throw new ConvexError('You must be logged in to join a team.');

    const teamCode = await ctx.db
      .query('inviteCodes')
      .withIndex('by_token', q => q.eq('token', token))
      .unique();
    if (!teamCode) throw new ConvexError('Token not found');
    if (!teamCode.isActive)
      throw new ConvexError('This team does not allow users to join');

    const existingMembership = await ctx.db
      .query('members')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', teamCode.teamId).eq('userId', user._id)
      )
      .unique();

    if (existingMembership) {
      return teamCode.teamId;
    }

    await ctx.db.insert('members', {
      teamId: teamCode.teamId,
      userId: user._id,
      role: 'member',
    });

    console.log(teamCode.teamId);

    return teamCode.teamId;
  },
});
