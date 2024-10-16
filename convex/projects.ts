import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { isAdmin, isMember } from './auth';
import { Projects } from './schema';

export const getProjects = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const member = await isMember(ctx, args.teamId);

    const projectMembers = await ctx.db
      .query('projectMembers')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', args.teamId).eq('userId', member._id)
      )
      .collect();
    const projectIds = projectMembers.map(projectMember => projectMember._id);
    const projects = await Promise.all(projectIds.map(id => ctx.db.get(id)));

    return projects;
  },
});

export const getAllTeamProjects = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const projects = await ctx.db
      .query('projects')
      .withIndex('by_teamId', q => q.eq('teamId', args.teamId))
      .order('desc')
      .collect();
    return projects;
  },
});

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
