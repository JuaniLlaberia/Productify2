'use client';

import {
  PlusCircle,
  Hash,
  Plus,
  MessageSquareText,
  Search,
} from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';

import SidebarLoader from '../../(components)/SidebarLoader';
import ChannelActions from './ChannelActions';
import InnerSidebarLink from '../../(components)/InnerSidebarLinks';
import ConversationActions from '../../conversations/(components)/ConversationActions';
import ConversationLink from '../../conversations/(components)/ConversationLink';
import ChannelForm from './ChannelForm';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';

const ChannelsLinks = () => {
  const pathname = usePathname();
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const channels = useQuery(api.channels.getChannels, {
    teamId,
  });
  const conversations = useQuery(api.conversations.getConversations, {
    teamId,
  });

  if (!channels || !conversations) return <SidebarLoader />;

  return (
    <>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        <li>
          <ChannelForm
            trigger={
              <button className='flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted/60'>
                <PlusCircle className='size-4 mr-1.5' strokeWidth={1.5} />
                New channel
              </button>
            }
          />
        </li>
        <InnerSidebarLink
          label='Threads'
          icon={
            <MessageSquareText className='size-4 mr-1.5' strokeWidth={1.5} />
          }
          link={`/team/${teamId}/channels/threads`}
          isActive={pathname.includes('/channels/threads')}
        />
        <InnerSidebarLink
          label='Browse'
          icon={<Search className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/channels/browse`}
          isActive={pathname.includes('/channels/browse')}
        />
      </ul>

      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2 group'>
        <span className='py-0.5'>Your channels</span>
        <ChannelForm
          trigger={
            <span className='hover:bg-muted/40 hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
              <Plus className='size-4' />
            </span>
          }
        />
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        {channels.length > 0 ? (
          channels.map(channel => (
            <InnerSidebarLink
              key={channel?._id}
              label={channel?.name as string}
              icon={
                channel?.icon ? (
                  <span className='size-4 mr-1.5'>{channel.icon}</span>
                ) : (
                  <Hash className='size-4 mr-1.5' strokeWidth={1.5} />
                )
              }
              link={`/team/${teamId}/channels/${channel?._id}`}
              isActive={pathname.includes(channel?._id as string)}
              options={channel ? <ChannelActions data={channel} /> : undefined}
            />
          ))
        ) : (
          <p className='text-muted-foreground text-sm px-2'>No channels</p>
        )}
      </ul>

      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2 group'>
        <span className='py-0.5'>Your conversations</span>
        {/* <ChannelForm
          trigger={
            <span className='hover:bg-muted/40 hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
              <Plus className='size-4' />
            </span>
          }
        /> */}
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        {conversations.length > 0 ? (
          conversations.map(({ conversationId, otherUser }) => (
            <ConversationLink
              key={conversationId}
              user={otherUser}
              link={`/team/${teamId}/conversations/${conversationId}`}
              isActive={pathname.includes(conversationId as string)}
              options={
                <ConversationActions
                  teamId={teamId}
                  conversationId={conversationId}
                />
              }
            />
          ))
        ) : (
          <p className='text-muted-foreground text-sm px-2'>No conversations</p>
        )}
      </ul>
    </>
  );
};

export default ChannelsLinks;
