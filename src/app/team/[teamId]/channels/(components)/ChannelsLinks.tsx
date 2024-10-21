'use client';

import Link from 'next/link';
import { Bookmark, PlusCircle, Hash, Plus } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';

import SidebarLoader from '../../(components)/SidebarLoader';
import ChannelForm from './ChannelForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';

const ChannelsLinks = () => {
  const pathname = usePathname();
  const { teamId } = useParams();

  const channels = useQuery(api.channels.getChannels, {
    teamId: teamId as Id<'teams'>,
  });
  if (!channels) return <SidebarLoader />;

  return (
    <Dialog>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <DialogTrigger asChild>
        <button className='flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200'>
          <PlusCircle className='size-4 mr-1.5' strokeWidth={1.5} />
          New channel
        </button>
      </DialogTrigger>
      <DialogContent>
        <ChannelForm />
      </DialogContent>
      <Link
        href={`/team/${teamId}/channels/saved`}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200',
          pathname.includes('my-tasks') ? 'bg-gray-200' : null
        )}
      >
        <Bookmark className='size-4 mr-1.5' strokeWidth={1.5} />
        Saved chats
      </Link>

      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mt-4 mb-2 group'>
        <span className='py-0.5'>Your channels</span>
        <DialogTrigger asChild>
          <span className='hover:bg-gray-200 hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
            <Plus className='size-4' />
          </span>
        </DialogTrigger>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        <li>
          <Link
            href={`/team/${teamId}/projects/my-tasks`}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200',
              pathname.includes('my-tasks') ? 'bg-gray-200' : null
            )}
          >
            <Hash className='size-4 mr-1.5' strokeWidth={1.5} />
            General
          </Link>
        </li>
        {channels.map(channel => (
          <li key={channel?._id}>
            <Link
              href={`/team/${teamId}/channels/${channel?._id}`}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200',
                pathname.includes('my-tasks') ? 'bg-gray-200' : null
              )}
            >
              {channel?.icon ? (
                channel.icon
              ) : (
                <Hash className='size-4 mr-1.5' strokeWidth={1.5} />
              )}
              {channel?.name}
            </Link>
          </li>
        ))}
      </ul>
    </Dialog>
  );
};

export default ChannelsLinks;
