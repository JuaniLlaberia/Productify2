'use client';

import { useParams } from 'next/navigation';
import { differenceInMinutes, format, isToday, isYesterday } from 'date-fns';

import Message from './Message';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { Id } from '../../../../../../convex/_generated/dataModel';

const formatDateLabel = (dateStr: string) => {
  const date = new Date(`${dateStr}T12:00:00Z`);
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesturday' : format(date, 'EEEE, MMMM d')}`;
};

const TIME_THRESHOLD = 5; //5 minutes

type MessageListProps = {
  variant?: 'channel' | 'thread' | 'conversation';
};

const MessagesList = ({ variant }: MessageListProps) => {
  const { teamId, channelId } = useParams<{
    teamId: Id<'teams'>;
    channelId?: Id<'channels'>;
  }>();

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
              prevMessage.member._id === message?.member._id &&
              differenceInMinutes(
                new Date(message._creationTime),
                new Date(prevMessage._creationTime)
              ) < TIME_THRESHOLD;

            return message ? (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                isAuthor={false}
                authorImage={message.member.profileImage}
                authorName={message.member.fullName}
                reactions={message.reactions}
                body={message.message}
                image={message.image}
                isEdited={message.isEdited}
                isEditing={false}
                setEditingId={() => {}}
                isCompact={isCompact || false}
                hideThreadButton={false}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestampt={message.threadTimestampt}
              />
            ) : null;
          })}
        </div>
      ))}
      {/* ADD CHANNEL HERO (like discord) */}
    </div>
  );
};

export default MessagesList;
