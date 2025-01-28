import { ConvexError, v } from 'convex/values';
import { omit } from 'convex-helpers';
import { paginationOptsValidator } from 'convex/server';

import { mutation, query } from './_generated/server';
import { Cabinets } from './schema';
import { isAdmin, isMember } from './auth';

// Cabinets functions
export const getAllCabinets = query({
  args: { teamId: v.id('teams'), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { teamId, paginationOpts } = args;
    const member = await isMember(ctx, args.teamId);

    const paginatedCabinets = await ctx.db
      .query('cabinets')
      .withIndex('by_teamId', q => q.eq('teamId', teamId))
      .paginate(paginationOpts);

    if (paginatedCabinets.page.length === 0) return paginatedCabinets;

    const memberCabinets = await ctx.db
      .query('cabinetMembers')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', args.teamId).eq('userId', member._id)
      )
      .collect();
    const memberCabinetsIds = new Set(
      memberCabinets.map(cabinet => cabinet.cabinetId)
    );

    const cabinets = paginatedCabinets.page.map(cabinet => ({
      ...cabinet,
      isMember: cabinet.private ? memberCabinetsIds.has(cabinet._id) : true,
    }));

    return {
      ...paginatedCabinets,
      page: cabinets,
    };
  },
});

export const getCabinets = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const { teamId } = args;
    const member = await isMember(ctx, teamId);

    const cabinets = await ctx.db
      .query('cabinets')
      .withIndex('by_teamId', q => q.eq('teamId', teamId))
      .collect();

    const memberCabinets = await ctx.db
      .query('cabinetMembers')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', teamId).eq('userId', member._id)
      )
      .collect();
    const memberCabinetsIds = new Set(
      memberCabinets.map(cabinet => cabinet.cabinetId)
    );

    return cabinets.filter(
      cabinet => !cabinet.private || memberCabinetsIds.has(cabinet._id)
    );
  },
});

export const createCabinet = mutation({
  args: {
    teamId: v.id('teams'),
    cabinetData: v.object(omit(Cabinets.withoutSystemFields, ['teamId'])),
  },
  handler: async (ctx, args) => {
    const { teamId, cabinetData } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    const cabinetId = await ctx.db.insert('cabinets', {
      ...cabinetData,
      teamId,
    });

    if (cabinetData.private)
      await ctx.db.insert('cabinetMembers', {
        userId: user._id,
        teamId,
        cabinetId,
      });

    return cabinetId;
  },
});

export const updateCabinet = mutation({
  args: {
    teamId: v.id('teams'),
    cabinetId: v.id('cabinets'),
    cabinetData: v.object(omit(Cabinets.withoutSystemFields, ['teamId'])),
  },
  handler: async (ctx, args) => {
    const { teamId, cabinetData, cabinetId } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.patch(cabinetId, {
      ...cabinetData,
    });
  },
});

export const deleteCabinet = mutation({
  args: { cabinetId: v.id('cabinets'), teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const { teamId, cabinetId } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.delete(cabinetId);

    //Implement cascading for tasks and all related elements or manually?
  },
});

//Cabinets members functions

export const getCabinetMembers = query({
  args: { cabinetId: v.id('cabinets'), teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const { cabinetId, teamId } = args;
    await isMember(ctx, teamId);

    const members = await ctx.db
      .query('cabinetMembers')
      .withIndex('by_cabinetId', q => q.eq('cabinetId', cabinetId))
      .collect();

    const membersWithData = await Promise.all(
      members.map(async member => {
        const userData = await ctx.db.get(member.userId);

        if (!userData) return null;

        return {
          ...userData,
          memberId: member._id,
          teamId: member.teamId,
        };
      })
    );

    return membersWithData.filter(
      (member): member is NonNullable<typeof member> => member !== null
    );
  },
});

export const createCabinetMembers = mutation({
  args: {
    cabinetId: v.id('cabinets'),
    userIds: v.array(v.id('users')),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const { teamId, cabinetId, userIds } = args;
    const user = await isAdmin(ctx, args.teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    const existingMembers = await ctx.db
      .query('cabinetMembers')
      .withIndex('by_cabinetId', q => q.eq('cabinetId', cabinetId))
      .collect();

    const newUserIds = userIds.filter(
      userId => !existingMembers.some(member => member.userId === userId)
    );

    if (newUserIds.length === 0) {
      throw new ConvexError('All selected users are already channel members');
    }

    await Promise.all(
      newUserIds.map(user =>
        ctx.db.insert('cabinetMembers', {
          teamId,
          cabinetId,
          userId: user,
        })
      )
    );
  },
});

export const removeCabinetMember = mutation({
  args: {
    cabinetMember: v.id('cabinetMembers'),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const { teamId, cabinetMember } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.delete(cabinetMember);
  },
});

export const leaveCabinet = mutation({
  args: {
    teamId: v.id('teams'),
    cabinetId: v.id('cabinets'),
  },
  handler: async (ctx, args) => {
    const { teamId, cabinetId } = args;
    const member = await isMember(ctx, teamId);

    const cabinet = await ctx.db.get(cabinetId);
    const cabinetMemberId = (
      await ctx.db
        .query('cabinetMembers')
        .withIndex('by_cabinetId_userId', q =>
          q.eq('cabinetId', cabinetId).eq('userId', member._id)
        )
        .first()
    )?._id;

    if (cabinet?.private && !cabinetMemberId)
      throw new ConvexError('You are not a member of this channel.');

    if (cabinetMemberId) await ctx.db.delete(cabinetMemberId);
  },
});
