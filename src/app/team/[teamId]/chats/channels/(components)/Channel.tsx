'use client';

import { useQuery } from 'convex/react';

import ChatInput from '../../(components)/ChatInput';
import ChatHeader from '../../(components)/ChatHeader';
import MessagesList from '../../(components)/MessagesList';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import ChannelHeaderMenu from './ChannelHeaderMenu';

type ChannelProps = {
  teamId: Id<'teams'>;
  channelId: Id<'channels'>;
  onClose?: () => void;
};

const Channel = ({ teamId, channelId, onClose }: ChannelProps) => {
  const channel = useQuery(api.channels.getChannelById, { teamId, channelId });

  return (
    <section className='w-full h-screen flex flex-col'>
      <ChatHeader
        chatName={channel?.name}
        chatIcon={channel?.icon}
        menu={<ChannelHeaderMenu data={channel!} />}
        onClose={onClose}
      />
      <MessagesList
        channelId={channelId}
        channelName={channel?.name}
        channelCreationTime={channel?._creationTime}
      />
      <ChatInput
        channelId={channelId}
        placeholder={`Send message to # ${channel?.name || 'Channel'}`}
      />
    </section>
  );
};

export default Channel;
