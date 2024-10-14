import { ConvexError, v } from 'convex/values';

import { mutation } from './_generated/server';
import { isAdmin } from './auth';
import { Projects } from './schema';

export const createProject = mutation({
  args: {
    teamId: v.id('teams'),
    projectData: v.object({
      name: v.string(),
      description: v.string(),
      public: v.boolean(),
      autojoin: v.boolean(),
      icons: Projects.withoutSystemFields.icons,
    }),
  },
  handler: async (ctx, args) => {
    const { teamId, projectData } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    const projectId = await ctx.db.insert('projects', {
      ...projectData,
      createdBy: user._id,
      teamId,
    });

    //If the project is public all users are part of it
    //If public is false, we keep track of members
    if (!projectData.public) {
      await ctx.db.insert('projectMembers', {
        userId: user._id,
        teamId,
        projectId,
      });
    }
  },
});

export const updateProject = mutation({
  args: {
    teamId: v.id('teams'),
    projectId: v.id('projects'),
    projectData: v.object({
      name: v.string(),
      description: v.string(),
      public: v.boolean(),
      autojoin: v.boolean(),
      icons: Projects.withoutSystemFields.icons,
    }),
  },
  handler: async (ctx, args) => {
    const { teamId, projectId, projectData } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.patch(projectId, {
      ...projectData,
      createdBy: user._id,
      teamId,
    });
  },
});

export const deleteProject = mutation({
  args: { projectId: v.id('projects'), teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const { teamId, projectId } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );
    await ctx.db.delete(projectId);

    //Implement cascading for tasks and all related elements or manually?
  },
});

export const createProjectMember = mutation({
  args: {
    projectId: v.id('projects'),
    userId: v.id('users'),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const user = await isAdmin(ctx, args.teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.insert('projectMembers', {
      ...args,
    });
  },
});

export const removeProjectMember = mutation({
  args: {
    projectMemberId: v.id('projectMembers'),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const { projectMemberId, teamId } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.delete(projectMemberId);
  },
});
