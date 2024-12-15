'use client';

import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import RemoveMemberModal from './RemoveMemberModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc, Id } from '../../../../../../../convex/_generated/dataModel';
import { RolesEnum } from '@/lib/enums';
import { useMemberRole } from '@/features/auth/api/useMemberRole';
import { Skeleton } from '@/components/ui/skeleton';

const MembersActions = ({
  member,
}: {
  member: Doc<'users'> & { role: RolesEnum; memberId: Id<'members'> };
}) => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const { isAdmin, isLoading } = useMemberRole(teamId);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  if (isLoading) return <Skeleton className='size-4' />;
  if (!isAdmin) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger>
        <Button variant='ghost' className='size-6 p-0 hover:bg-muted'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal
            className='size-4 text-muted-foreground'
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <RemoveMemberModal
          teamId={teamId}
          memberId={member.memberId}
          trigger={
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Trash2 className='size-3.5 mr-2' strokeWidth={1.5} />
              Remove member
            </DropdownMenuItem>
          }
          onSuccess={() => setIsOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MembersActions;
