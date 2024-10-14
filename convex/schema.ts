import { defineSchema } from 'convex/server';
import { v } from 'convex/values';
import { Table } from 'convex-helpers/server';

export const Users = Table('users', {
  fullName: v.string(),
  email: v.string(),
  profileImage: v.optional(v.string()),
  clerkIdentifier: v.string(),
  stripeId: v.optional(v.string()),
});

export default defineSchema({
  users: Users.table
    .index('by_clerkId', ['clerkIdentifier'])
    .index('by_email', ['email']),
});
