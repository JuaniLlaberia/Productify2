'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

import MessageLoader from '../../(components)/MessageLoader';
import Message from '../../(components)/Message';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { useGetThreads } from '@/features/messages/api/useGetThreads';

const ThreadsList = () => {
  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);

  const {
    results: messages,
    loadMore,
    status,
  } = useGetThreads({
    teamId,
    threadsOnly: true,
  });

  if (status === 'LoadingFirstPage')
    return (
      <ul className='flex flex-col flex-1'>
        {[1, 2, 3, 4, 5].map((_, index) => (
          <MessageLoader key={index} />
        ))}
      </ul>
    );

  if (messages.length === 0)
    return (
      <section className='h-full w-full flex items-center justify-center text-muted-foreground'>
        No threads
      </section>
    );

  return (
    <div className='p-4 w-full flex-1 flex flex-col overflow-y-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-muted scrollbar-track-transparent'>
      {messages.map(message => {
        return (
          message && (
            <Message
              key={message._id}
              id={message._id}
              teamId={teamId}
              isAuthor={true}
              authorImage={message.user.image}
              authorName={message.user.fullName}
              reactions={message.reactions}
              body={message.message}
              image={message.image}
              isEdited={message.isEdited}
              isEditing={editingId === message._id}
              setEditingId={setEditingId}
              isCompact={false}
              hideThreadButton={false}
              createdAt={message._creationTime}
              threadCount={message.threadCount}
              threadImage={message.threadImage}
              threadTimestampt={message.threadTimestampt}
            />
          )
        );
      })}
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
    </div>
  );
};

export default ThreadsList;
