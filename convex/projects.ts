import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { isAdmin, isMember } from './auth';
import { Projects } from './schema';

export const getProjects = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    // Verify team membership
    const member = await isMember(ctx, args.teamId);

    // Get all public projects for the team
    const allTeamPublicProjects = await ctx.db
      .query('projects')
      .withIndex('by_teamId', q => q.eq('teamId', args.teamId))
      .filter(q => q.eq(q.field('private'), false))
      .collect();

    // Get project IDs where user is a member
    const projectMembers = await ctx.db
      .query('projectMembers')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', args.teamId).eq('userId', member._id)
      )
      .collect();

    const projectIds = projectMembers.map(
      projectMember => projectMember.projectId
    );
    const userProjects = await Promise.all(
      projectIds.map(id => ctx.db.get(id))
    );

    const projects = [...allTeamPublicProjects, ...userProjects];

    // Sort by creation date descending (assuming you want to keep the ordering)
    return projects.sort((a, b) => b!._creationTime - a!._creationTime);
  },
});

export const getProjectById = query({
  args: { teamId: v.id('teams'), projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const project = await ctx.db
      .query('projects')
      .withIndex('by_id', q => q.eq('_id', args.projectId))
      .first();

    return project;
  },
});

export const getProjectMembers = query({
  args: { teamId: v.id('teams'), projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const projectMembers = await ctx.db
      .query('projectMembers')
      .withIndex('by_projectId', q => q.eq('projectId', args.projectId))
      .collect();
    const projectMembersIds = projectMembers.map(member => member.userId);
    const membersData = await Promise.all(
      projectMembersIds.map(member => ctx.db.get(member))
    );

    return membersData;
  },
});

export const createProject = mutation({
  args: {
    teamId: v.id('teams'),
    projectData: v.object({
      name: v.string(),
      private: v.boolean(),
      icon: Projects.withoutSystemFields.icon,
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

    //If the project is private all users are part of it
    //If private is false, we keep track of members
    if (projectData.private) {
      await ctx.db.insert('projectMembers', {
        userId: user._id,
        teamId,
        projectId,
      });
    }

    return projectId;
  },
});

export const updateProject = mutation({
  args: {
    teamId: v.id('teams'),
    projectId: v.id('projects'),
    projectData: v.object({
      name: v.string(),
      private: v.boolean(),
      icon: Projects.withoutSystemFields.icon,
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

export const leaveProject = mutation({
  args: {
    teamId: v.id('teams'),
    projectId: v.id('projects'),
  },
  handler: async (ctx, args) => {
    const { teamId, projectId } = args;
    const member = await isMember(ctx, teamId);

    const projectMemberId = (
      await ctx.db
        .query('projectMembers')
        .withIndex('by_projectId_memberId', q =>
          q.eq('projectId', projectId).eq('userId', member._id)
        )
        .first()
    )?._id;

    if (!projectMemberId)
      throw new ConvexError('You are not a member of this project.');

    await ctx.db.delete(projectMemberId);
  },
});
