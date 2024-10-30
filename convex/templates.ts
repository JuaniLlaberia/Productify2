import { omit } from 'convex-helpers';
import { v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { Templates } from './schema';
import { isMember } from './auth';

export const getProjectTemplates = query({
  args: {
    teamId: v.id('teams'),
    projectId: v.id('projects'),
    filters: v.object({
      status: v.optional(Templates.withoutSystemFields.status),
      priority: v.optional(Templates.withoutSystemFields.priority),
      label: v.optional(Templates.withoutSystemFields.label),
    }),
  },
  handler: async (ctx, args) => {
    const {
      teamId,
      projectId,
      filters: { status, priority, label },
    } = args;
    await isMember(ctx, teamId);

    let query = ctx.db
      .query('templates')
      .withIndex('by_teamId_projectId', q =>
        q.eq('teamId', teamId).eq('projectId', projectId)
      );

    if (status) query = query.filter(q => q.eq(q.field('status'), status));
    if (priority)
      query = query.filter(q => q.eq(q.field('priority'), priority));
    if (label) query = query.filter(q => q.eq(q.field('label'), label));

    const templates = await Promise.all(
      (await query.order('desc').collect()).map(async template => ({
        ...template,
        assignee: template.assignee
          ? await ctx.db.get(template.assignee)
          : null,
        label: template.label ? await ctx.db.get(template.label) : null,
      }))
    );
    return templates;
  },
});

export const createTemplate = mutation({
  args: Templates.withoutSystemFields,
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    await ctx.db.insert('templates', {
      ...args,
    });
  },
});

export const updateTemplate = mutation({
  args: {
    teamId: v.id('teams'),
    templateId: v.id('templates'),
    templateData: v.object(
      omit(Templates.withoutSystemFields, ['teamId', 'projectId'])
    ),
  },
  handler: async (ctx, args) => {
    const { teamId, templateData, templateId } = args;
    await isMember(ctx, teamId);

    await ctx.db.patch(templateId, {
      ...templateData,
    });
  },
});

export const deleteTemplate = mutation({
  args: { teamId: v.id('teams'), templatesIds: v.array(v.id('templates')) },
  handler: async (ctx, args) => {
    const { teamId, templatesIds } = args;
    await isMember(ctx, teamId);

    await Promise.all(
      templatesIds.map(templateId => ctx.db.delete(templateId))
    );
  },
});
