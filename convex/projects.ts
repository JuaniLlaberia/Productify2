import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { isAdmin, isMember } from './helpers';
import { Projects } from './schema';
import { paginationOptsValidator } from 'convex/server';

//Projects functions
export const getAllProjects = query({
  args: { teamId: v.id('teams'), paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const { teamId, paginationOpts } = args;
    const member = await isMember(ctx, args.teamId);
    if (!member) throw new ConvexError('You are not a member of this team');

    const paginatedProjects = await ctx.db
      .query('projects')
      .withIndex('by_teamId', q => q.eq('teamId', teamId))
      .paginate(paginationOpts);

    if (paginatedProjects.page.length === 0) return paginatedProjects;

    const memberProjects = await ctx.db
      .query('projectMembers')
      .withIndex('by_teamId_userId', q =>
        q.eq('teamId', args.teamId).eq('userId', member._id)
      )
      .collect();
    const memberProjectsIds = new Set(
      memberProjects.map(project => project.projectId)
    );

    const projects = paginatedProjects.page.map(project => ({
      ...project,
      isMember: project.private ? memberProjectsIds.has(project._id) : true,
    }));

    return {
      ...paginatedProjects,
      page: projects,
    };
  },
});

export const getProjects = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    // Verify team membership
    const member = await isMember(ctx, args.teamId);
    if (!member) throw new ConvexError('You are not a member of this team');

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

//Project members funcitons

export const getProjectMembers = query({
  args: { teamId: v.id('teams'), projectId: v.id('projects') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const members = await ctx.db
      .query('projectMembers')
      .withIndex('by_projectId', q => q.eq('projectId', args.projectId))
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

export const createProjectMember = mutation({
  args: {
    projectId: v.id('projects'),
    userIds: v.array(v.id('users')),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const { teamId, projectId, userIds } = args;
    const user = await isAdmin(ctx, args.teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    const existingMembers = await ctx.db
      .query('projectMembers')
      .withIndex('by_projectId', q => q.eq('projectId', projectId))
      .collect();

    const newUserIds = userIds.filter(
      userId => !existingMembers.some(member => member.userId === userId)
    );

    if (newUserIds.length === 0) {
      throw new ConvexError('All selected users are already project members');
    }

    await Promise.all(
      newUserIds.map(user =>
        ctx.db.insert('projectMembers', {
          teamId,
          projectId,
          userId: user,
        })
      )
    );
  },
});

export const removeProjectMember = mutation({
  args: {
    projectMember: v.id('projectMembers'),
    teamId: v.id('teams'),
  },
  handler: async (ctx, args) => {
    const { projectMember, teamId } = args;

    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.delete(projectMember);
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
    if (!member) throw new ConvexError('You are not a member of this team');

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
