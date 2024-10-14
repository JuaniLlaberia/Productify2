import { ConvexError } from 'convex/values';
import { MutationCtx, QueryCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

export const isAuth = async (ctx: QueryCtx | MutationCtx) => {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) return null;

  const user = await ctx.db
    .query('users')
    .withIndex('by_email', q => q.eq('email', identity.email as string))
    .first();

  if (!user) return null;
  else return user;
};

export const isAdmin = async (
  ctx: QueryCtx | MutationCtx,
  teamId: Id<'teams'>
) => {
  //Check that the user is authenticated
  const user = await isAuth(ctx);
  if (!user) throw new ConvexError('Must be logged in.');

  //Check user permissions in team
  const userRole = await ctx.db
    .query('members')
    .withIndex('by_teamId_userId', q =>
      q.eq('teamId', teamId).eq('userId', user._id)
    )
    .first();

  if (!userRole) throw new ConvexError('User is not a member of this team.');

  if (userRole.role === 'member') return null;
  return { ...user, role: userRole.role };
};

export const isMember = async (
  ctx: QueryCtx | MutationCtx,
  teamId: Id<'teams'>
) => {
  //Check that the user is authenticated
  const user = await isAuth(ctx);
  if (!user) throw new ConvexError('Must be logged in.');

  //Check user is member of team
  const member = await ctx.db
    .query('members')
    .withIndex('by_teamId_userId', q =>
      q.eq('teamId', teamId).eq('userId', user._id)
    )
    .first();

  if (!member) throw new ConvexError('User is not a member of this team.');
  return { ...user, role: member.role };
};
