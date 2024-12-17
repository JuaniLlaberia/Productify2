'use client';

import Link from 'next/link';
import { Edit, Expand, LogOut, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import StorageForm from './StorageForm';
import LeaveStorageModal from './LeaveStorageModal';
import DeleteStorageModal from './DeleteStorageModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMemberRole } from '@/features/auth/api/useMemberRole';
import { Doc } from '../../../../../../convex/_generated/dataModel';

const StoragesActions = ({ data }: { data: Doc<'storages'> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const { isAdmin } = useMemberRole(data.teamId);
  const hasPermissions = isAdmin;

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='size-5 p-0 hover:bg-muted'
        >
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
        <DropdownMenuItem className='text-sm' asChild>
          <Link href={`/team/${data.teamId}/storages/${data._id}`}>
            <Expand className='size-3.5 mr-2' strokeWidth={1.5} /> Open
          </Link>
        </DropdownMenuItem>
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
          teamId={data.teamId}
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
              teamId={data.teamId}
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
  );
};

export default StoragesActions;
