'use client';

import { useQuery } from 'convex/react';
import { Hash } from 'lucide-react';
import { useParams } from 'next/navigation';

import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Skeleton } from '@/components/ui/skeleton';

const ChannelHeader = () => {
  const { teamId, channelId } = useParams<{
    teamId: Id<'teams'>;
    channelId: Id<'channels'>;
  }>();
  const channel = useQuery(api.channels.getChannelById, { teamId, channelId });

  return (
    <nav className='flex items-center gap-2.5 w-full p-2 px-4 border-b border-border'>
      {channel ? (
        <>
          <div className='p-1 rounded bg-muted text-muted-foreground'>
            {channel.icon ? (
              channel.icon
            ) : (
              <Hash className='size-4' strokeWidth={1.5} />
            )}
          </div>
          <h1 className='text-sm font-medium'>{channel.name}</h1>
        </>
      ) : (
        <Skeleton className='h-8 w-32' />
      )}
    </nav>
  );
};

export default ChannelHeader;
