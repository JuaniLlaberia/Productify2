import { ConvexError, v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';
import { omit } from 'convex-helpers';

import { mutation, query } from './_generated/server';
import { isAdmin, isMember } from './auth';
import { Storages } from './schema';

export const getStorageById = query({
  args: { teamId: v.id('teams'), storageId: v.id('storages') },
  handler: async (ctx, args) => {
    const { teamId, storageId } = args;
    await isMember(ctx, teamId);

    return await ctx.db.get(storageId);
  },
});

export const getAllStorages = query({
  args: { teamId: v.id('teams'), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { teamId, paginationOpts } = args;
    const member = await isMember(ctx, args.teamId);

    const paginatedStorages = await ctx.db
      .query('storages')
      .withIndex('by_teamId', q => q.eq('teamId', teamId))
      .paginate(paginationOpts);

    if (paginatedStorages.page.length === 0) return paginatedStorages;

    const memberStorages = await ctx.db
      .query('storagesMembers')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', args.teamId).eq('userId', member._id)
      )
      .collect();
    const memberStoragesIds = new Set(
      memberStorages.map(storage => storage.storageId)
    );

    const storages = paginatedStorages.page.map(storage => ({
      ...storage,
      isMember: storage.private ? memberStoragesIds.has(storage._id) : true,
    }));

    return {
      ...paginatedStorages,
      page: storages,
    };
  },
});

export const getUserStorages = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const member = await isMember(ctx, args.teamId);

    const allTeamPublicStorages = await ctx.db
      .query('storages')
      .withIndex('by_teamId', q => q.eq('teamId', args.teamId))
      .filter(q => q.eq(q.field('private'), false))
      .collect();

    const storageMembers = await ctx.db
      .query('storagesMembers')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', args.teamId).eq('userId', member._id)
      )
      .collect();
    const storagesIds = storageMembers.map(
      storageMember => storageMember.storageId
    );
    const userStorages = await Promise.all(
      storagesIds.map(id => ctx.db.get(id))
    );
    const storages = [...allTeamPublicStorages, ...userStorages];

    return storages.sort((a, b) => b!._creationTime - a!._creationTime);
  },
});

export const createStorage = mutation({
  args: {
    teamId: v.id('teams'),
    storageData: v.object(omit(Storages.withoutSystemFields, ['teamId'])),
  },
  handler: async (ctx, args) => {
    const { teamId, storageData } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    const storageId = await ctx.db.insert('storages', {
      ...storageData,
      teamId,
    });

    if (storageData.private)
      await ctx.db.insert('storagesMembers', {
        userId: user._id,
        teamId,
        storageId,
      });

    return storageId;
  },
});

export const updateStorage = mutation({
  args: {
    teamId: v.id('teams'),
    storageId: v.id('storages'),
    storageData: v.object(omit(Storages.withoutSystemFields, ['teamId'])),
  },
  handler: async (ctx, args) => {
    const { teamId, storageData, storageId } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.patch(storageId, {
      ...storageData,
    });
  },
});

export const deleteStorage = mutation({
  args: { teamId: v.id('teams'), storageId: v.id('storages') },
  handler: async (ctx, args) => {
    const { teamId, storageId } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.delete(storageId);

    //IMPLEMENT DELETING EVERYTHING RELATED TO IT
  },
});

export const leaveStorage = mutation({
  args: {
    teamId: v.id('teams'),
    storageId: v.id('storages'),
  },
  handler: async (ctx, args) => {
    const { teamId, storageId } = args;
    const member = await isMember(ctx, teamId);

    const storage = await ctx.db.get(storageId);
    const storageMemberId = (
      await ctx.db
        .query('storagesMembers')
        .withIndex('by_storageId_userId', q =>
          q.eq('storageId', storageId).eq('userId', member._id)
        )
        .first()
    )?._id;

    if (storage?.private && !storageMemberId)
      throw new ConvexError('You are not a member of this channel.');

    if (storageMemberId) await ctx.db.delete(storageMemberId);
  },
});
