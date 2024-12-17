import { omit } from 'convex-helpers';
import { v } from 'convex/values';
import { paginationOptsValidator } from 'convex/server';

import { mutation, query } from './_generated/server';
import { Assets } from './schema';
import { isMember } from './auth';

export const getAssets = query({
  args: {
    teamId: v.id('teams'),
    storageId: v.id('storages'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const { teamId, storageId, paginationOpts } = args;
    await isMember(ctx, teamId);

    const results = await ctx.db
      .query('assets')
      .withIndex('by_teamId_storageId', q =>
        q.eq('teamId', teamId).eq('storageId', storageId)
      )
      .paginate(paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page.map(async asset => {
          const fileUrl = await ctx.storage.getUrl(asset.fileId);

          return {
            ...asset,
            fileUrl,
            createdBy: await ctx.db.get(asset.createdBy),
          };
        })
      ),
    };
  },
});

export const createAssets = mutation({
  args: {
    teamId: v.id('teams'),
    assets: v.array(v.object(omit(Assets.withoutSystemFields, ['createdBy']))),
  },
  handler: async (ctx, args) => {
    const { teamId, assets } = args;
    const member = await isMember(ctx, teamId);

    await Promise.all(
      assets.map(async asset => {
        await ctx.db.insert('assets', {
          ...asset,
          createdBy: member._id,
        });
      })
    );
  },
});

export const updateAsset = mutation({
  args: {
    teamId: v.id('teams'),
    assetId: v.id('assets'),
    assetData: v.object(
      omit(Assets.withoutSystemFields, [
        'fileId',
        'createdBy',
        'size',
        'storageId',
        'teamId',
        'type',
        'lastModified',
      ])
    ),
  },
  handler: async (ctx, args) => {
    const { teamId, assetData, assetId } = args;
    await isMember(ctx, teamId);

    await ctx.db.patch(assetId, {
      ...assetData,
    });
  },
});

export const deleteAssets = mutation({
  args: {
    teamId: v.id('teams'),
    assets: v.array(
      v.object({
        assetId: v.id('assets'),
        fileIdInStorage: v.id('_storage'),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { teamId, assets } = args;
    await isMember(ctx, teamId);

    await Promise.all(
      assets.map(async asset => {
        await Promise.all([
          ctx.storage.delete(asset.fileIdInStorage),
          ctx.db.delete(asset.assetId),
        ]);
      })
    );
  },
});
