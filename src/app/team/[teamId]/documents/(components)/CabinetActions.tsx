'use client';

import { Edit, LogOut, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import CabinetForm from './CabinetForm';
import LeaveCabinetModal from './LeaveCabinetModal';
import DeleteCabinetModal from './DeleteCabinetModal';
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

const CabinetActions = ({ data }: { data: Doc<'cabinets'> }) => {
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
        {hasPermissions && (
          <CabinetForm
            cabinetData={data}
            trigger={
              <DropdownMenuItem
                className='text-sm'
                onSelect={e => e.preventDefault()}
              >
                <Edit className='size-3.5 mr-2' strokeWidth={1.5} />
                Edit cabinet
              </DropdownMenuItem>
            }
            onClose={() => setIsDropdownOpen(false)}
          />
        )}
        {data.private && (
          <>
            <DropdownMenuSeparator />
            <LeaveCabinetModal
              teamId={data.teamId}
              cabinetId={data._id}
              trigger={
                <DropdownMenuItem
                  className='text-sm'
                  onSelect={e => e.preventDefault()}
                >
                  <LogOut className='size-3.5 mr-2' strokeWidth={1.5} />
                  Leave cabinet
                </DropdownMenuItem>
              }
              onSuccess={() => setIsDropdownOpen(false)}
            />
          </>
        )}

        {hasPermissions && (
          <>
            <DropdownMenuSeparator />
            <DeleteCabinetModal
              teamId={data.teamId}
              cabinetId={data._id}
              cabinetName={data.name}
              trigger={
                <DropdownMenuItem
                  className='text-sm'
                  onSelect={e => e.preventDefault()}
                >
                  <Trash2 className='size-3.5 mr-2' strokeWidth={1.5} />
                  Delete cabinet
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

export default CabinetActions;
