import { ConvexError, v } from 'convex/values';

import { mutation, query } from './_generated/server';
import { isAdmin, isAuth, isMember } from './auth';
import { Members, Teams } from './schema';
import { generateCode } from './inviteCodes';
import { internal } from './_generated/api';

export const getUserTeams = query({
  handler: async ctx => {
    const user = await isAuth(ctx);
    if (!user) throw new ConvexError('Must be logged in.');

    const teams = await ctx.db
      .query('members')
      .withIndex('by_userId', q => q.eq('userId', user._id))
      .collect();
    const teamsIds = teams.map(team => team.teamId);

    const teamsData = await Promise.all(teamsIds.map(id => ctx.db.get(id)));

    const teamsDataWithImage = await Promise.all(
      teamsData.map(async team => {
        const image = team?.imageId
          ? await ctx.storage.getUrl(team.imageId)
          : undefined;

        return { ...team, imageUrl: image };
      })
    );

    return teamsDataWithImage;
  },
});

export const getTeam = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const team = await ctx.db.get(args.teamId);
    if (!team) throw new ConvexError('Team does not exist');

    const image = team.imageId
      ? await ctx.storage.getUrl(team.imageId)
      : undefined;

    return { ...team, imageUrl: image };
  },
});

export const getTeamMembers = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    await isMember(ctx, args.teamId);

    const members = await ctx.db
      .query('members')
      .withIndex('by_teamId', q => q.eq('teamId', args.teamId))
      .collect();
    const membersWithData = await Promise.all(
      members.map(async member => {
        const userData = await ctx.db.get(member.userId);
        return {
          ...userData,
          role: member.role,
          memberId: member._id,
        };
      })
    );

    return membersWithData;
  },
});

export const createTeam = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const user = await isAuth(ctx);
    if (!user) throw new ConvexError('Must be logged in.');

    //Create team
    const teamId = await ctx.db.insert('teams', {
      name: args.name,
      status: 'inactive',
      createdBy: user._id,
    });

    await Promise.all([
      //Create member with owner permissions
      ctx.db.insert('members', {
        teamId,
        userId: user._id,
        role: 'owner',
      }),
      //Update user onBoardingCompleted to TRUE
      ctx.db.patch(user._id, { onBoardingCompleted: true }),
      //Create default channel
      ctx.db.insert('channels', {
        name: 'General',
        private: false,
        teamId,
      }),
      //Generate invite link
      ctx.runMutation(internal.inviteCodes.generateCode, { teamId }),
    ]);

    return teamId;
  },
});

export const getMemberRole = query({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const member = await isMember(ctx, args.teamId);
    const memberData = await ctx.db.get(member.memberId);

    return memberData?.role;
  },
});

export const updateTeam = mutation({
  args: {
    teamId: v.id('teams'),
    teamData: v.object({
      name: v.optional(Teams.withoutSystemFields.name),
      status: v.optional(Teams.withoutSystemFields.status),
      imageId: v.optional(Teams.withoutSystemFields.imageId),
    }),
  },
  handler: async (ctx, args) => {
    const user = await isAdmin(ctx, args.teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.patch(args.teamId, { ...args.teamData });
  },
});

export const deleteTeam = mutation({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const user = await isAdmin(ctx, args.teamId);
    if (!user?.role || user?.role === 'admin')
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    //Delete team
    await ctx.db.delete(args.teamId);
    //Delete all data related to this team
    //Research about ENTS and Triggers => Cascading deletions
  },
});

export const leaveTeam = mutation({
  args: { teamId: v.id('teams') },
  handler: async (ctx, args) => {
    const member = await isMember(ctx, args.teamId);

    await ctx.db.delete(member.memberId);
  },
});

export const deleteMember = mutation({
  args: { teamId: v.id('teams'), memberToDelete: v.id('members') },
  handler: async (ctx, args) => {
    const { teamId, memberToDelete } = args;
    const user = await isAdmin(ctx, teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    const member = await ctx.db.get(memberToDelete);
    if (member?.teamId !== teamId)
      throw new ConvexError('This is not a member from this team.');

    await ctx.db.delete(member._id);
  },
});

export const updateMemberRole = mutation({
  args: {
    memberId: v.id('members'),
    teamId: v.id('teams'),
    role: Members.withoutSystemFields.role,
  },
  handler: async (ctx, args) => {
    const user = await isAdmin(ctx, args.teamId);
    if (!user?.role)
      throw new ConvexError(
        'User does not have permissions to perform this action.'
      );

    await ctx.db.patch(args.memberId, { role: args.role });
  },
});
