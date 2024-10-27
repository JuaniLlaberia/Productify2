'use client';

import { Bookmark, PlusCircle, Hash, Plus } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';

import SidebarLoader from '../../(components)/SidebarLoader';
import InnerSidebarLink from '../../(components)/InnerSidebarLinks';
import ChannelForm from './ChannelForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
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
      <ul className='flex flex-col gap-0.5 mb-4'>
        <li>
          <DialogTrigger asChild>
            <button className='flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted/40'>
              <PlusCircle className='size-4 mr-1.5' strokeWidth={1.5} />
              New channel
            </button>
          </DialogTrigger>
        </li>
        <InnerSidebarLink
          label='Saved chats'
          icon={<Bookmark className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/channels/saved`}
          isActive={pathname.includes('/channels/saved')}
        />
      </ul>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2 group'>
        <span className='py-0.5'>Your channels</span>
        <DialogTrigger asChild>
          <span className='hover:bg-muted/40 hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
            <Plus className='size-4' />
          </span>
        </DialogTrigger>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        <InnerSidebarLink
          label='General'
          icon={<Hash className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/channels/general`}
          isActive={pathname.includes('/channels/general')}
        />
        {channels.map(channel => (
          <InnerSidebarLink
            key={channel?._id}
            label={channel?.name as string}
            icon={
              channel?.icon ? (
                channel.icon
              ) : (
                <Hash className='size-4 mr-1.5' strokeWidth={1.5} />
              )
            }
            link={`/team/${teamId}/channels/${channel?._id}`}
            isActive={pathname.includes(channel?._id as string)}
          />
        ))}
      </ul>
      <DialogContent>
        <ChannelForm />
      </DialogContent>
    </Dialog>
  );
};

export default ChannelsLinks;
