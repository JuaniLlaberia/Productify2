import { ConvexError, v } from 'convex/values';

import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import { isAuth, isMember } from './auth';
import { Doc, Id } from './_generated/dataModel';

const documentBelongsToMember = async (
  ctx: QueryCtx | MutationCtx,
  documentId: Id<'documents'>
) => {
  const user = await isAuth(ctx);
  if (!user) throw new ConvexError('Must be logged in.');

  const document = await ctx.db
    .query('documents')
    .withIndex('by_id', q => q.eq('_id', documentId))
    .first();
  if (!document) throw new ConvexError('Document does not exist.');
  if (document?.createdBy !== user._id)
    throw new ConvexError('This document does not belong to this user.');
  else return true;
};

export const getTeamDocuments = query({
  args: {
    teamId: v.id('teams'),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_teamId_parentId', q =>
        q.eq('teamId', args.teamId).eq('parentDocument', args.parentDocument)
      )
      .filter(q => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect();

    return documents;
  },
});

export const getDocument = query({
  args: { teamId: v.id('teams'), documentId: v.id('documents') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const document = await ctx.db
      .query('documents')
      .withIndex('by_id', q => q.eq('_id', args.documentId))
      .first();

    return document;
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    teamId: v.id('teams'),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const { title, teamId, parentDocument } = args;
    const member = await isMember(ctx, teamId);

    const documentId = await ctx.db.insert('documents', {
      title: title || 'Untitled',
      isArchived: false,
      isPublished: false,
      createdBy: member._id,
      teamId,
      parentDocument,
    });

    return documentId;
  },
});

export const deleteDocument = mutation({
  args: {
    documentId: v.id('documents'),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const [member] = await Promise.all([
      isMember(ctx, args.teamId),
      documentBelongsToMember(ctx, args.documentId),
    ]);

    const recursiveDelete = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_userId_parentId', q =>
          q.eq('createdBy', member._id).eq('parentDocument', documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.delete(child._id);

        await recursiveDelete(child._id);
      }
    };

    await ctx.db.delete(args.documentId);
    recursiveDelete(args.documentId);
  },
});

export const archiveDocument = mutation({
  args: { documentId: v.id('documents'), teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const [member] = await Promise.all([
      isMember(ctx, args.teamId),
      documentBelongsToMember(ctx, args.documentId),
    ]);

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_userId_parentId', q =>
          q.eq('createdBy', member._id).eq('parentDocument', documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: true });

        await recursiveArchive(child._id);
      }
    };

    await ctx.db.patch(args.documentId, { isArchived: true });
    recursiveArchive(args.documentId);
  },
});

export const restoreDocument = mutation({
  args: { documentId: v.id('documents'), teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const [member] = await Promise.all([
      isMember(ctx, args.teamId),
      documentBelongsToMember(ctx, args.documentId),
    ]);

    const existingDocument = await ctx.db.get(args.documentId);
    if (!existingDocument) throw new ConvexError('Document does not exist');

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_userId_parentId', q =>
          q.eq('createdBy', member._id).eq('parentDocument', documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: false });

        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<'documents'>> = { isArchived: false };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) {
        options.parentDocument = undefined;
      }
    }

    await ctx.db.patch(args.documentId, options);
    recursiveRestore(args.documentId);
  },
});

//Missing writing to a document
//Missing cover image functionalities
