'use client';

import { Edit, LogOut, MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import ChannelForm from './ChannelForm';
import DeleteChannelModal from './DeleteChannelModal';
import LeaveChannelModal from './LeaveChannelModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc } from '../../../../../../convex/_generated/dataModel';

const ChannelActions = ({ data }: { data: Doc<'channels'> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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
        <ChannelForm
          channelData={data}
          trigger={
            <DropdownMenuItem
              className='text-xs'
              onSelect={e => e.preventDefault()}
            >
              <Edit className='size-3.5 mr-2' strokeWidth={1.5} />
              Edit channel
            </DropdownMenuItem>
          }
          onClose={() => setIsDropdownOpen(false)}
        />
        <DropdownMenuSeparator />
        <LeaveChannelModal
          teamId={data.teamId}
          channelId={data._id}
          trigger={
            <DropdownMenuItem
              className='text-xs'
              onSelect={e => e.preventDefault()}
            >
              <LogOut className='size-3.5 mr-2' strokeWidth={1.5} />
              Leave channel
            </DropdownMenuItem>
          }
          onSuccess={() => setIsDropdownOpen(false)}
        />
        <DeleteChannelModal
          teamId={data.teamId}
          channelId={data._id}
          channelName={data.name}
          trigger={
            <DropdownMenuItem
              className='text-xs'
              onSelect={e => e.preventDefault()}
            >
              <Trash2 className='size-3.5 mr-2' strokeWidth={1.5} />
              Delete channel
            </DropdownMenuItem>
          }
          onSuccess={() => setIsDropdownOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ChannelActions;
