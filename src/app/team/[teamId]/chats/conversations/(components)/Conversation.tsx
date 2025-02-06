'use client';

import { useQuery } from 'convex/react';

import ChatHeader from '../../(components)/ChatHeader';
import MessagesList from '../../(components)/MessagesList';
import ConversationHeaderMenu from './ConversationHeaderMenu';
import ChatInput from '../../(components)/ChatInput';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

type ConversationProps = {
  teamId: Id<'teams'>;
  conversationId: Id<'conversations'>;
  onClose?: () => void;
};

const Conversation = ({
  teamId,
  conversationId,
  onClose,
}: ConversationProps) => {
  const conversation = useQuery(api.conversations.getConversationById, {
    teamId,
    conversationId,
  });

  return (
    <section className='w-full h-screen flex flex-col'>
      <ChatHeader
        chatName={conversation?.otherUser?.fullName}
        chatIcon={
          <Avatar className='size-7 mr-1 shrink-0'>
            <AvatarImage
              src={conversation?.otherUser?.image}
              alt='Profile photo'
            />
            <AvatarFallback asChild>
              <Skeleton className='size-7' />
            </AvatarFallback>
          </Avatar>
        }
        menu={<ConversationHeaderMenu conversationId={conversationId} />}
        onClose={onClose}
      />
      <MessagesList
        variant='conversation'
        conversationId={conversationId}
        channelName={conversation?.otherUser?.fullName}
        channelCreationTime={conversation?._creationTime}
      />
      <ChatInput
        conversationId={conversationId}
        placeholder={`Send message to # ${conversation?.otherUser?.fullName || 'Conversation'}`}
      />
    </section>
  );
};

export default Conversation;
