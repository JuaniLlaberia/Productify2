'use client';

import {
  Edit,
  LogOut,
  PanelRight,
  Settings2,
  Trash2,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import LeaveChannelModal from '../../(components)/LeaveChannelModal';
import DeleteChannelModal from './DeleteChannelModal';
import ChannelForm from './ChannelForm';
import Channel from './Channel';
import Hint from '@/components/ui/hint';
import { Button } from '@/components/ui/button';
import { Doc, Id } from '../../../../../../../convex/_generated/dataModel';
import { usePanel } from '../../../(context)/PanelContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import ChannelMembers from './ChannelMembers';
import { useMemberRole } from '@/features/auth/api/useMemberRole';

const ChannelSettingsMenu = ({ data }: { data?: Doc<'channels'> }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const { openPanel, closePanel } = usePanel();

  const { isAdmin } = useMemberRole(teamId);
  const hasPermissions = isAdmin;

  if (!data) return <Skeleton className='h-full w-16' />;

  const handleConversationSidebar = () => {
    openPanel({
      content: (
        <Channel
          key={data._id}
          teamId={teamId}
          channelId={data._id}
          onClose={closePanel}
        />
      ),
    });
  };

  const handleMembersSidebar = () => {
    openPanel({
      content: <ChannelMembers channelId={data._id} onClose={closePanel} />,
    });
  };

  return (
    <ul className='flex gap-2'>
      <li>
        <Hint label='Open in sidebar'>
          <Button
            size='icon'
            variant='ghost'
            onClick={handleConversationSidebar}
          >
            <PanelRight className='size-5' strokeWidth={1.5} />
          </Button>
        </Hint>
      </li>
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
            <DropdownMenuItem onClick={handleMembersSidebar}>
              <Users className='size-3.5 mr-2' strokeWidth={1.5} />
              Members
            </DropdownMenuItem>
            {hasPermissions && (
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
            )}
            <DropdownMenuSeparator />
            <LeaveChannelModal
              teamId={teamId}
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
            {hasPermissions && (
              <>
                <DropdownMenuSeparator />
                <DeleteChannelModal
                  teamId={teamId}
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
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </li>
    </ul>
  );
};

export default ChannelSettingsMenu;
