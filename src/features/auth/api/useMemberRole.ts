import { useQuery } from 'convex/react';

import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

export function useMemberRole(teamId: Id<'teams'>) {
  const role = useQuery(api.teams.getMemberRole, { teamId });

  const isLoading = !role;

  const isOwner = role === 'owner';
  const isAdmin = role === 'owner' || role === 'admin';
  const isMember = role !== null;

  return {
    role,
    isLoading,
    isOwner,
    isAdmin,
    isMember,
  };
}
