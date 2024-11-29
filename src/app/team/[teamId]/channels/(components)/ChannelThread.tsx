'use state';

import Quill from 'quill';
import dynamic from 'next/dynamic';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { toast } from 'sonner';
import { differenceInMinutes, format } from 'date-fns';

import Message from './Message';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { api } from '../../../../../../convex/_generated/api';
import { useGetMessages } from '@/features/messages/api/useGetMessages';
import { formatDateLabel, TIME_THRESHOLD } from './MessagesList';

const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

type ChannelThreadProps = {
  messageId: Id<'messages'>;
  onClose: () => void;
};

/*
NOTE: TODO/TO-CHECK
 - Fetch or pass props from message
 - Reusability with message and with message list
*/

const ChannelThread = ({ onClose, messageId }: ChannelThreadProps) => {
  const { teamId, channelId } = useParams<{
    teamId: Id<'teams'>;
    channelId: Id<'channels'>;
  }>();

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
  const [editorKey, setEditorKey] = useState<number>(0);
  const [isPending, setIsPending] = useState<boolean>(false);

  const editorRef = useRef<Quill | null>(null);

  const createMsg = useMutation(api.messages.createMessage);
  const getUploadUrl = useMutation(api.upload.generateUploadUrl);

  const message = useQuery(api.messages.getMessageById, { teamId, messageId });
  const user = useQuery(api.users.getUser);
  const { results, loadMore, status } = useGetMessages({
    teamId,
    channelId,
    parentMessageId: messageId,
  });

  if (!message || status === 'LoadingFirstPage')
    return (
      <div className='h-full flex flex-col space-y-2'>
        <div className='h-12 flex justify-between items-center p-4 border-b'>
          <p>Thread</p>
          <Button onClick={onClose} variant='ghost' size='icon'>
            <X className='size-4' strokeWidth={1.5} />
          </Button>
        </div>
        <div className='flex items-center justify-center h-full'>
          <Loader2 className='size-6 animate-spin' strokeWidth={1.5} />
        </div>
      </div>
    );

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      //Image upload
      const message: {
        teamId: Id<'teams'>;
        channelId: Id<'channels'>;
        parentMessageId: Id<'messages'>;
        message: string;
        image?: Id<'_storage'>;
      } = {
        teamId,
        channelId,
        parentMessageId: messageId,
        message: body,
      };

      if (image) {
        const uploadUrl = await getUploadUrl();
        if (!uploadUrl) throw new Error('Url not found');

        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        });

        if (!response.ok) throw new Error('Failed to upload image');

        const { storageId } = await response.json();
        message.image = storageId;
      }

      //Create message
      await createMsg(message);

      //Check if this trick is efficient or not
      setEditorKey(prev => prev + 1);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

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
    <div className='h-full flex flex-col space-y-2'>
      <div className='h-12 flex justify-between items-center p-4 border-b'>
        <p>Thread</p>
        <Button onClick={onClose} variant='ghost' size='icon'>
          <X className='size-4' strokeWidth={1.5} />
        </Button>
      </div>
      <div className='px-4 w-full flex-1 flex flex-col-reverse overflow-y-auto scrollbar-none hover:scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-muted scrollbar-track-transparent'>
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
                    hideThreadButton={true}
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
        {message ? (
          <Message
            hideThreadButton
            id={message._id}
            teamId={teamId}
            isAuthor={message.user._id === user?._id}
            authorImage={message.user.profileImage}
            authorName={message.user.fullName}
            reactions={message.reactions}
            body={message.message}
            image={message.image}
            isEdited={message.isEdited}
            createdAt={message._creationTime}
            isEditing={editingId === message._id}
            setEditingId={setEditingId}
          />
        ) : (
          <div className='flex flex-col gap-2 items-center justify-center h-full'>
            <div className='p-2 bg-muted rounded-lg border border-border'>
              <AlertTriangle className='size-6' />
            </div>
            <p className='text-muted-foreground text-center'>
              Failed to load thread
            </p>
          </div>
        )}
      </div>
      <div className='px-4'>
        <Editor
          key={editorKey}
          innerRef={editorRef}
          onSubmit={handleSubmit}
          disabled={isPending}
          placeholder='Reply...'
        />
      </div>
    </div>
  );
};

export default ChannelThread;
