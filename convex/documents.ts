import { ConvexError, v } from 'convex/values';
import { omit } from 'convex-helpers';

import { mutation, MutationCtx, query, QueryCtx } from './_generated/server';
import { isAdmin, isMember } from './auth';
import { Doc, Id } from './_generated/dataModel';
import { Documents } from './schema';

//Function to check if a document belongs to auth user or not
const documentBelongsToMember = async (
  ctx: QueryCtx | MutationCtx,
  documentId: Id<'documents'>,
  userId: Id<'users'>
) => {
  const document = await ctx.db
    .query('documents')
    .withIndex('by_id', q => q.eq('_id', documentId))
    .first();
  if (!document) throw new ConvexError('Document does not exist.');

  if (document?.createdBy !== userId) return false;
  else return true;
};

export const getDocuments = query({
  args: {
    teamId: v.id('teams'),
    cabinetId: v.id('cabinets'),
    parentDocument: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const user = await isMember(ctx, args.teamId);

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_cabinetId', q => q.eq('cabinetId', args.cabinetId))
      .filter(q =>
        q.and(
          q.eq(q.field('parentDocument'), args.parentDocument),
          q.eq(q.field('isArchived'), false),
          q.or(
            q.eq(q.field('private'), false),
            q.and(
              q.eq(q.field('private'), true),
              q.eq(q.field('createdBy'), user._id)
            )
          )
        )
      )
      .collect();

    return documents;
  },
});

export const getDocumentChildren = query({
  args: {
    teamId: v.id('teams'),
    cabinetId: v.id('cabinets'),
    parentDocumentId: v.optional(v.id('documents')),
  },
  handler: async (ctx, args) => {
    const { teamId, cabinetId, parentDocumentId } = args;
    const member = await isMember(ctx, teamId);

    const cabinet = await ctx.db.get(cabinetId);
    if (cabinet?.private) {
      const cabinetMember = await ctx.db
        .query('cabinetMembers')
        .withIndex('by_teamId_userId', q =>
          q.eq('teamId', teamId).eq('userId', member._id)
        )
        .filter(q => q.eq(q.field('cabinetId'), cabinet._id))
        .first();

      if (!cabinetMember)
        throw new ConvexError('You are not allow to acccess this data');
    }

    return await ctx.db
      .query('documents')
      .withIndex('by_teamId_parentId', q =>
        q.eq('teamId', teamId).eq('parentDocument', parentDocumentId)
      )
      .filter(q => q.eq(q.field('isArchived'), false)) // Remove docs that are archived
      .filter(q => q.eq(q.field('private'), false)) // Remove docs that are private
      .order('desc')
      .collect();
  },
});

export const getDocument = query({
  args: { teamId: v.id('teams'), documentId: v.id('documents') },
  handler: async (ctx, args) => {
    const member = await isMember(ctx, args.teamId);

    const document = await ctx.db
      .query('documents')
      .withIndex('by_id', q => q.eq('_id', args.documentId))
      .first();

    if (document?.private && member._id !== document.createdBy) return null;

    return document;
  },
});

//Create document => Private by default you can make it public
export const createDocument = mutation({
  args: {
    documentData: v.object(
      omit(Documents.withoutSystemFields, ['teamId', 'createdBy'])
    ),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const { teamId, documentData } = args;
    const member = await isMember(ctx, teamId);

    const documentId = await ctx.db.insert('documents', {
      createdBy: member._id,
      teamId,
      ...documentData,
    });

    return documentId;
  },
});

export const updateDocument = mutation({
  args: {
    teamId: v.id('teams'),
    cabinetId: v.id('cabinets'),
    documentId: v.id('documents'),
    documentData: v.object(
      omit(Documents.withoutSystemFields, ['teamId', 'cabinetId', 'createdBy'])
    ),
  },
  handler: async (ctx, args) => {
    const { teamId, documentData, documentId, cabinetId } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    const cabinetMember = await ctx.db
      .query('cabinetMembers')
      .withIndex('by_cabinetId_userId', q =>
        q.eq('cabinetId', cabinetId).eq('userId', user._id)
      )
      .first();
    if (!cabinetMember)
      throw new ConvexError('You do not belong to this cabinet');

    await ctx.db.patch(documentId, {
      ...documentData,
    });
  },
});

//Delete document and all of its children if document belongs to you or if you are an admin/owner
export const deleteDocument = mutation({
  args: {
    documentId: v.id('documents'),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const { teamId, documentId } = args;

    const member = await isMember(ctx, teamId);
    const belongsToUser = await documentBelongsToMember(
      ctx,
      documentId,
      member._id
    );

    if (!belongsToUser && member.role === 'member')
      throw new ConvexError('You can not perform this action.');

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
    const { documentId, teamId } = args;
    const member = await isMember(ctx, teamId);
    const belongsToUser = await documentBelongsToMember(
      ctx,
      documentId,
      member._id
    );

    if (!belongsToUser)
      throw new Error('You are not allow to perform this action');

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
    const { documentId, teamId } = args;
    const member = await isMember(ctx, teamId);
    const belongsToUser = await documentBelongsToMember(
      ctx,
      documentId,
      member._id
    );

    if (!belongsToUser)
      throw new Error('You are not allow to perform this action');

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
