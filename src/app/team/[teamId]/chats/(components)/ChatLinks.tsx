'use client';

import { Hash, Plus, MessageSquareText, Database } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';

import SidebarLoader from '../../(components)/SidebarLoader';
import ChannelActions from '../channels/(components)/ChannelActions';
import ConversationForm from '../conversations/(components)/ConversationForm';
import InnerSidebarLink from '../../(components)/InnerSidebarLinks';
import ConversationActions from '../conversations/(components)/ConversationActions';
import NewChatBtn from './NewChatBtn';
import ConversationLink from '../conversations/(components)/ConversationLink';
import ChannelForm from '../channels/(components)/ChannelForm';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useMemberRole } from '@/features/auth/api/useMemberRole';

const ChatLinks = () => {
  const pathname = usePathname();
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const channels = useQuery(api.channels.getChannels, {
    teamId,
  });
  const conversations = useQuery(api.conversations.getConversations, {
    teamId,
  });

  const { isLoading, isAdmin } = useMemberRole(teamId);
  const hasPermissions = isAdmin;

  if (!channels || !conversations || isLoading) return <SidebarLoader />;

  return (
    <>
      {/* GENERAL CHATS LINKS */}
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        <li>
          <NewChatBtn />
        </li>
        <InnerSidebarLink
          label='Threads'
          icon={
            <MessageSquareText className='size-4 mr-1.5' strokeWidth={1.5} />
          }
          link={`/team/${teamId}/chats/threads`}
          isActive={pathname.includes('/chats/threads')}
        />
        <InnerSidebarLink
          label='Channels'
          icon={<Database className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/chats/channels`}
          isActive={/^\/team\/[^/]+\/chats\/channels$/.test(pathname)}
        />
      </ul>

      {/* CHANNELS LINKS */}
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2 group'>
        <span className='py-0.5'>Your channels</span>
        {hasPermissions && (
          <ChannelForm
            trigger={
              <span className='hover:bg-muted/40 hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
                <Plus className='size-4' />
              </span>
            }
          />
        )}
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
              link={`/team/${teamId}/chats/channels/${channel?._id}`}
              isActive={pathname.includes(channel?._id as string)}
              options={channel ? <ChannelActions data={channel} /> : undefined}
            />
          ))
        ) : (
          <p className='text-muted-foreground text-sm px-2'>No channels</p>
        )}
      </ul>

      {/* CONVERSATIONS LINKS */}
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2 group'>
        <span className='py-0.5'>Your conversations</span>
        <ConversationForm
          trigger={
            <span className='hover:bg-muted/40 hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
              <Plus className='size-4' />
            </span>
          }
        />
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        {conversations.length > 0 ? (
          conversations.map(({ conversationId, otherUser }) => (
            <ConversationLink
              key={conversationId}
              user={otherUser}
              link={`/team/${teamId}/chats/conversations/${conversationId}`}
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

export default ChatLinks;
