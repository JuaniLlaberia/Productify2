import { defineSchema } from 'convex/server';
import { v } from 'convex/values';
import { Table } from 'convex-helpers/server';

const prioritySchema = v.union(
  v.literal('low'),
  v.literal('medium'),
  v.literal('high'),
  v.literal('urgent')
);

const taskStatusSchema = v.union(
  v.literal('backlog'),
  v.literal('todo'),
  v.literal('in-progress'),
  v.literal('completed'),
  v.literal('canceled')
);

export const Users = Table('users', {
  fullName: v.string(),
  email: v.string(),
  profileImage: v.optional(v.string()),
  location: v.optional(v.string()),
  description: v.optional(v.string()),
  clerkIdentifier: v.string(),
  onBoardingCompleted: v.boolean(),
});

export const Teams = Table('teams', {
  name: v.string(),
  imageId: v.optional(v.id('_storage')),
  status: v.union(
    v.literal('active'),
    v.literal('inactive'),
    v.literal('mantainance')
  ),
  joinCode: v.optional(v.number()),
  createdBy: v.id('users'),
});

export const InviteCodes = Table('inviteCodes', {
  token: v.string(),
  isActive: v.boolean(),
  teamId: v.id('teams'),
});

export const Members = Table('members', {
  userId: v.id('users'),
  teamId: v.id('teams'),
  role: v.union(v.literal('owner'), v.literal('admin'), v.literal('member')),
});

export const Projects = Table('projects', {
  name: v.string(),
  icon: v.optional(v.string()),
  private: v.boolean(),
  createdBy: v.id('users'),
  teamId: v.id('teams'),
});

export const ProjectMembers = Table('projectMembers', {
  userId: v.id('users'),
  projectId: v.id('projects'),
  teamId: v.id('teams'),
});

export const Tasks = Table('taks', {
  title: v.string(),
  projectId: v.id('projects'),
  teamId: v.id('teams'),

  priority: v.optional(prioritySchema),
  status: v.optional(taskStatusSchema),
  description: v.optional(v.string()),
  label: v.optional(v.id('labels')),
  dueDate: v.optional(v.number()),
  assignee: v.optional(v.id('users')),
});

export const SubTasks = Table('subtasks', {
  title: v.optional(v.string()),
  parentId: v.id('tasks'),
  projectId: v.id('projects'),
  teamId: v.id('teams'),
  completed: v.boolean(),
});

export const Labels = Table('labels', {
  title: v.string(),
  color: v.string(),
  teamId: v.id('teams'),
  projectId: v.id('projects'),
  createdBy: v.id('users'),
});

export const Templates = Table('templates', {
  title: v.string(),
  projectId: v.id('projects'),
  teamId: v.id('teams'),

  status: v.optional(taskStatusSchema),
  priority: v.optional(prioritySchema),
  description: v.optional(v.string()),
  label: v.optional(v.id('labels')),
  assignee: v.optional(v.id('users')),
});

export const Channels = Table('channels', {
  name: v.string(),
  icon: v.optional(v.string()),
  private: v.boolean(),
  teamId: v.id('teams'),
});

export const ChannelMembers = Table('channelMembers', {
  userId: v.id('users'),
  channelId: v.id('channels'),
  teamId: v.id('teams'),
});

export const Conversations = Table('conversations', {
  teamId: v.id('teams'),
  userOneId: v.id('users'),
  userTwoId: v.id('users'),
  userPair: v.string(),
});

export const Messages = Table('messages', {
  message: v.string(),
  image: v.optional(v.id('_storage')),
  channelId: v.optional(v.id('channels')),
  teamId: v.id('teams'),
  userId: v.id('users'),
  isEdited: v.boolean(),
  hasThread: v.optional(v.boolean()),
  conversationId: v.optional(v.id('conversations')),
  parentMessageId: v.optional(v.id('messages')),
  updatedAt: v.optional(v.number()),
});

export const Reactions = Table('reactions', {
  teamId: v.id('teams'),
  messageId: v.id('messages'),
  userId: v.id('users'),
  value: v.string(),
});

export const Reports = Table('reports', {
  title: v.string(),
  description: v.string(),
  type: v.union(
    v.literal('interface'),
    v.literal('functional'),
    v.literal('performance'),
    v.literal('security'),
    v.literal('other')
  ),
  priority: prioritySchema,
  teamId: v.id('teams'),
  projectId: v.id('projects'),
  createdBy: v.id('users'),
});

export const Documents = Table('documents', {
  title: v.optional(v.string()),
  content: v.optional(v.string()),
  isArchived: v.boolean(),
  icon: v.optional(v.string()),
  converImage: v.optional(v.string()),
  isPublished: v.boolean(),
  parentDocument: v.optional(v.id('documents')),
  createdBy: v.id('users'),
  teamId: v.id('teams'),
});

export const Resources = Table('resources', {
  title: v.string(),
  type: v.union(v.literal('link'), v.literal('file')),
  category: v.union(
    v.literal('documentation'),
    v.literal('reference'),
    v.literal('article')
  ),
  teamId: v.id('teams'),
  createdBy: v.id('users'),
});

export default defineSchema({
  users: Users.table
    .index('by_clerkId', ['clerkIdentifier'])
    .index('by_email', ['email']),
  teams: Teams.table.index('by_joinCode', ['joinCode']),
  inviteCodes: InviteCodes.table
    .index('by_teamId', ['teamId'])
    .index('by_token', ['token']),
  members: Members.table
    .index('by_userId', ['userId'])
    .index('by_teamId', ['teamId'])
    .index('by_teamId_userId', ['teamId', 'userId']),
  projects: Projects.table.index('by_teamId', ['teamId']),
  projectMembers: ProjectMembers.table
    .index('by_projectId', ['projectId'])
    .index('by_projectId_memberId', ['projectId', 'userId'])
    .index('by_teamId_userId', ['teamId', 'userId']),
  tasks: Tasks.table
    .index('by_teamId_projectId', ['teamId', 'projectId'])
    .index('by_teamId_assignee', ['teamId', 'assignee']),
  subTasks: SubTasks.table.index('by_parentId', ['parentId']),
  labels: Labels.table.index('by_teamId_projectId', ['teamId', 'projectId']),
  templates: Templates.table.index('by_teamId_projectId', [
    'teamId',
    'projectId',
  ]),
  channels: Channels.table.index('by_teamId', ['teamId']),
  channelMembers: ChannelMembers.table
    .index('by_channelId_userId', ['channelId', 'userId'])
    .index('by_teamId_userId', ['teamId', 'userId']),
  conversations: Conversations.table
    .index('by_teamId', ['teamId'])
    .index('by_team_users_unique', ['teamId', 'userPair']),
  messages: Messages.table
    .index('by_teamId_userId', ['teamId', 'userId'])
    .index('by_teamId_conversationId', ['teamId', 'conversationId'])
    .index('by_channelId_parentId_conversationId', [
      'channelId',
      'parentMessageId',
      'conversationId',
    ])
    .index('by_parentId', ['parentMessageId']),
  reactions: Reactions.table
    .index('by_teamId', ['teamId'])
    .index('by_messageId', ['messageId'])
    .index('by_userId', ['userId']),
  reports: Reports.table.index('by_teamId_projectId', ['teamId', 'projectId']),
  documents: Documents.table
    .index('by_userId', ['createdBy'])
    .index('by_userId_parentId', ['createdBy', 'parentDocument'])
    .index('by_teamId', ['teamId'])
    .index('by_teamId_parentId', ['teamId', 'parentDocument']),
  resources: Resources.table.index('by_teamId', ['teamId']),
});
