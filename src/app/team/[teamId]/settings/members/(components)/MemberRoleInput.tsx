'use client';

import { useMutation } from 'convex/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import Badge, { ColorsType } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROLE_COLORS } from '@/lib/consts';
import { RolesEnum } from '@/lib/enums';
import { api } from '../../../../../../../convex/_generated/api';
import { useMemberRole } from '@/features/auth/api/useMemberRole';
import { Id } from '../../../../../../../convex/_generated/dataModel';

const MemberRoleInput = ({
  memberId,
  role,
}: {
  memberId: Id<'members'>;
  role: RolesEnum;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const updateMemberRole = useMutation(api.teams.updateMemberRole);
  const { isAdmin } = useMemberRole(teamId);

  const handleUpdateMemberRole = async (role: RolesEnum) => {
    setIsLoading(true);

    try {
      await updateMemberRole({ teamId, role, memberId });
    } catch {
      toast.error('Failed to update member role');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAdmin)
    return <Badge text={role} color={ROLE_COLORS[role] as ColorsType} />;

  return (
    <Select
      value={role}
      onValueChange={(val: RolesEnum) => handleUpdateMemberRole(val)}
      disabled={isLoading}
    >
      <SelectTrigger className='border-0 h-auto p-0'>
        <SelectValue placeholder='Member role' />
      </SelectTrigger>
      <SelectContent>
        {Object.values(RolesEnum).map(role => (
          <SelectItem value={role} key={role}>
            <Badge text={role} color={ROLE_COLORS[role] as ColorsType} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default MemberRoleInput;
