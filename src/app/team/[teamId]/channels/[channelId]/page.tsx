'use client';

import { useQuery } from 'convex/react';

import ChatInput from '../(components)/ChannelInput';
import ChannelHeader from '../(components)/ChannelHeader';
import MessagesList from '../(components)/MessagesList';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';

const ChannelPage = ({
  params: { teamId, channelId },
}: {
  params: {
    teamId: Id<'teams'>;
    channelId: Id<'channels'>;
  };
}) => {
  const channel = useQuery(api.channels.getChannelById, { teamId, channelId });

  return (
    <section className='w-full h-screen flex flex-col'>
      <ChannelHeader channelName={channel?.name} channelIcon={channel?.icon} />
      <MessagesList
        channelName={channel?.name}
        channelCreationTime={channel?._creationTime}
      />
      <ChatInput
        placeholder={`Send message to # ${channel?.name || 'Channel'}`}
      />
    </section>
  );
};

export default ChannelPage;
