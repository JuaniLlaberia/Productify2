import { useRef } from 'react';
import { ConvexError } from 'convex/values';
import { getAuthUserId } from '@convex-dev/auth/server';

import { useQuery } from 'convex/react';
import { MutationCtx, QueryCtx } from './_generated/server';
import { Id } from './_generated/dataModel';

//Not fully reactive query fn => Ideal when filtering data
export const useStableQuery = ((name, ...args) => {
  const result = useQuery(name, ...args);
  const stored = useRef(result);

  if (result !== undefined) stored.current = result;

  return stored.current;
}) as typeof useQuery;

export const isAuth = async (ctx: QueryCtx | MutationCtx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    return null;
  }
  return await ctx.db.get(userId);
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

  if (!member) return null;
  return { ...user, role: member.role, memberId: member._id };
};
