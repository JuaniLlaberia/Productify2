'use client';

import Link from 'next/link';
import {
  Edit,
  Expand,
  LogOut,
  MoreHorizontal,
  PanelRight,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import ChannelForm from './ChannelForm';
import DeleteChannelModal from './DeleteChannelModal';
import LeaveChannelModal from '../../(components)/LeaveChannelModal';
import Channel from './Channel';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Doc } from '../../../../../../../convex/_generated/dataModel';
import { usePanel } from '../../../(context)/PanelContext';

const ChannelActions = ({ data }: { data: Doc<'channels'> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { openPanel, closePanel } = usePanel();

  const handleChannelSidebar = () => {
    openPanel({
      content: (
        <Channel
          key={data._id}
          teamId={data.teamId}
          channelId={data._id}
          onClose={closePanel}
        />
      ),
    });
  };

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
          <Link href={`/team/${data.teamId}/chats/channels/${data._id}`}>
            <Expand className='size-3.5 mr-2' strokeWidth={1.5} /> Open
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className='text-sm' onClick={handleChannelSidebar}>
          <PanelRight className='size-3.5 mr-2' strokeWidth={1.5} />
          View in sidebar
        </DropdownMenuItem>
        <ChannelForm
          channelData={data}
          trigger={
            <DropdownMenuItem
              className='text-sm'
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
              className='text-sm'
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
              className='text-sm'
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
