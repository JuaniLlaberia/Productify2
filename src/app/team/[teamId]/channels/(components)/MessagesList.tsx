'use client';

import { useParams } from 'next/navigation';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';
import { useState } from 'react';
import { useQuery } from 'convex/react';
import { Loader2 } from 'lucide-react';

import Message from './Message';
import ChannelHero from './ChannelHero';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';

const formatDateLabel = (dateStr: string) => {
  const date = new Date(`${dateStr}T12:00:00Z`);
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesturday' : format(date, 'EEEE, MMMM d')}`;
};

const TIME_THRESHOLD = 5; //5 minutes

type MessageListProps = {
  channelName?: string;
  channelCreationTime?: number;
  variant?: 'channel' | 'thread' | 'conversation';
};

const MessagesList = ({
  channelName,
  channelCreationTime,
  variant = 'channel',
}: MessageListProps) => {
  const { teamId, channelId } = useParams<{
    teamId: Id<'teams'>;
    channelId?: Id<'channels'>;
  }>();
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const user = useQuery(api.users.getUser);

  const { results, loadMore, status } = useGetMessages({
    teamId,
    channelId,
  });

  if (status === 'LoadingFirstPage') return <div>LOADING</div>;

  const groupedMessages = results.reduce(
    (groups, message) => {
      const date = new Date(message!._creationTime);
      const dateKey = format(date, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);

      return groups;
    },
    {} as Record<string, typeof results>
  );

  return (
    <div className='p-4 w-full flex-1 flex flex-col-reverse overflow-y-auto messages-scrollbar'>
      {Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
        <div key={dateKey}>
          <div className='text-center my-2 relative'>
            <hr className='absolute top-1/2 left-0 right-0 border-t border-border' />
            <span className='relative inline-block px-4 py-1 rounded-lg border border-border bg-accent shadow-sm text-xs'>
              {formatDateLabel(dateKey)}
            </span>
          </div>
          {messages.map((message, index) => {
            const prevMessage = messages[index - 1];
            const isCompact =
              prevMessage &&
              prevMessage.user._id === message?.user._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;

            return (
              message && (
                <Message
                  key={message._id}
                  id={message._id}
                  teamId={teamId}
                  isAuthor={message.user._id === user?._id}
                  authorImage={message.user.profileImage}
                  authorName={message.user.fullName}
                  reactions={message.reactions}
                  body={message.message}
                  image={message.image}
                  isEdited={message.isEdited}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact || false}
                  hideThreadButton={variant === 'thread'}
                  createdAt={message._creationTime}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestampt={message.threadTimestampt}
                />
              )
            );
          })}
        </div>
      ))}
      <div
        className='h-1'
        ref={el => {
          if (el) {
            const observer = new IntersectionObserver(
              ([entry]) => {
                if (entry.isIntersecting && status === 'CanLoadMore')
                  loadMore();
              },
              { threshold: 1.0 }
            );

            observer.observe(el);
            return () => observer.disconnect();
          }
        }}
      />
      {status === 'LoadingMore' && (
        <div className='text-center my-2 relative'>
          <hr className='absolute top-1/2 left-0 right-0 border-t border-border' />
          <span className='relative inline-block px-4 py-1 rounded-lg border border-border bg-accent shadow-sm text-xs'>
            <Loader2 className='size-4 animate-spin' />
          </span>
        </div>
      )}
      {variant === 'channel' && channelName && channelCreationTime && (
        <ChannelHero name={channelName} creationTime={channelCreationTime} />
      )}
    </div>
  );
};

export default MessagesList;
