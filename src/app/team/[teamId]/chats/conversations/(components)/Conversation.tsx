'use client';

import { useQuery } from 'convex/react';

import ChatHeader from '../../(components)/ChatHeader';
import MessagesList from '../../(components)/MessagesList';
import ChatInput from '../../(components)/ChatInput';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ConversationHeaderMenu from './ConversationHeaderMenu';

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
          <Avatar className='size-6 mr-1.5'>
            <AvatarFallback className='size-6 mr-1.5'>
              {conversation?.otherUser?.fullName.at(0)?.toUpperCase() || 'M'}
            </AvatarFallback>
            <AvatarImage src={conversation?.otherUser?.profileImage} />
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
