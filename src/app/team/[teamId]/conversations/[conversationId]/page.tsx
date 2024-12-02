'use client';

import { useQuery } from 'convex/react';

import ChannelHeader from '../../channels/(components)/ChannelHeader';
import MessagesList from '../../channels/(components)/MessagesList';
import ChatInput from '../../channels/(components)/ChannelInput';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ConversationPage = ({
  params: { teamId, conversationId },
}: {
  params: {
    teamId: Id<'teams'>;
    conversationId: Id<'conversations'>;
  };
}) => {
  const conversation = useQuery(api.conversations.getConversationById, {
    teamId,
    conversationId,
  });

  return (
    <section className='w-full h-screen flex flex-col'>
      <ChannelHeader
        channelName={conversation?.otherUser?.fullName}
        channelIcon={
          <Avatar className='size-6 mr-1.5'>
            <AvatarFallback className='size-6 mr-1.5'>
              {conversation?.otherUser?.fullName.at(0)?.toUpperCase() || 'M'}
            </AvatarFallback>
            <AvatarImage src={conversation?.otherUser?.profileImage} />
          </Avatar>
        }
      />
      <MessagesList
        variant='conversation'
        channelName={conversation?.otherUser?.fullName}
        channelCreationTime={conversation?._creationTime}
      />
      <ChatInput
        placeholder={`Send message to # ${conversation?.otherUser?.fullName || 'Conversation'}`}
      />
    </section>
  );
};

export default ConversationPage;
