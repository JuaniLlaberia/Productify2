'use client';

import { Edit, LogOut, Settings2, Trash2, Users } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import Hint from '@/components/ui/hint';
import { Button } from '@/components/ui/button';

import StorageForm from './StorageForm';
import LeaveStorageModal from './LeaveStorageModal';
import DeleteStorageModal from './DeleteStorageModal';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useMemberRole } from '@/features/auth/api/useMemberRole';
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { usePanel } from '../../(context)/PanelContext';
import StorageMembers from './StorageMembers';

const StoragesSettingsMenu = ({ data }: { data?: Doc<'storages'> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const { openPanel, closePanel } = usePanel();

  const { isAdmin } = useMemberRole(teamId);
  const hasPermissions = isAdmin;

  if (!data) return <Skeleton className='h-full w-16' />;

  const handleMembersSidebar = () => {
    openPanel({
      content: <StorageMembers storageId={data._id} onClose={closePanel} />,
    });
  };

  return (
    <ul className='flex gap-2'>
      <li>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger>
            <Hint label='Settings'>
              <Button size='icon' variant='ghost'>
                <Settings2 className='size-5' strokeWidth={1.5} />
              </Button>
            </Hint>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {data.private && (
              <DropdownMenuItem onClick={handleMembersSidebar}>
                <Users className='size-3.5 mr-2' strokeWidth={1.5} />
                Members
              </DropdownMenuItem>
            )}
            {hasPermissions && (
              <StorageForm
                storageData={data}
                trigger={
                  <DropdownMenuItem
                    className='text-sm'
                    onSelect={e => e.preventDefault()}
                  >
                    <Edit className='size-3.5 mr-2' strokeWidth={1.5} />
                    Edit storage
                  </DropdownMenuItem>
                }
                onClose={() => setIsDropdownOpen(false)}
              />
            )}
            <DropdownMenuSeparator />
            <LeaveStorageModal
              teamId={teamId}
              storageId={data._id}
              trigger={
                <DropdownMenuItem
                  className='text-sm'
                  onSelect={e => e.preventDefault()}
                >
                  <LogOut className='size-3.5 mr-2' strokeWidth={1.5} />
                  Leave storage
                </DropdownMenuItem>
              }
              onSuccess={() => setIsDropdownOpen(false)}
            />
            {hasPermissions && (
              <>
                <DropdownMenuSeparator />
                <DeleteStorageModal
                  teamId={teamId}
                  storageId={data._id}
                  storageName={data.name}
                  trigger={
                    <DropdownMenuItem
                      className='text-sm'
                      onSelect={e => e.preventDefault()}
                    >
                      <Trash2 className='size-3.5 mr-2' strokeWidth={1.5} />
                      Delete storage
                    </DropdownMenuItem>
                  }
                  onSuccess={() => setIsDropdownOpen(false)}
                />
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>
  );
};

export default StoragesSettingsMenu;
