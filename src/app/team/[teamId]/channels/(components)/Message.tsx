'use client';

import dynamic from 'next/dynamic';
import { format, isToday, isYesterday } from 'date-fns';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import Thumbnail from '@/components/ui/thumbnail';
import Hint from '@/components/ui/hint';
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageToolbar } from './MessageToolbar';
import { api } from '../../../../../../convex/_generated/api';
import { cn } from '@/lib/utils';

const Renderer = dynamic(() => import('@/components/Renderer'), { ssr: false });
const Editor = dynamic(() => import('@/components/Editor'), { ssr: false });

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesturday' : format(date, 'MMM d, yyyy')} at ${format(date, 'hh:mm:ss a')}`;
};

type MessageProps = {
  id: Id<'messages'>;
  memberId?: Id<'members'>;
  teamId: Id<'teams'>;
  isAuthor: boolean;
  authorImage?: string;
  authorName?: string;
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>;
    }
  >;
  body: Doc<'messages'>['message'];
  image: string | null | undefined;
  createdAt: Doc<'messages'>['_creationTime'];
  updatedAt: Doc<'messages'>['updatedAt'];
  isEdited: boolean;
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<'messages'> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadTimestampt?: number;
};

// FIX LOADING STATES

const Message = ({
  id,
  isAuthor,
  memberId,
  teamId,
  authorImage,
  authorName = 'Member',
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEdited,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestampt,
}: MessageProps) => {
  const updateMessage = useMutation(api.messages.updateMessage);

  const handleUpdate = async ({ body }: { body: string }) => {
    try {
      await updateMessage({
        teamId,
        messageId: id,
        messageData: { message: body },
      });
      toast.success('Message updated successfully');
      setEditingId(null);
    } catch {
      toast.error('Failed to update message');
    }
  };

  if (isCompact)
    return (
      <div
        className={cn(
          'flex flex-col gap-2 p-1.5 px-5 hover:bg-muted/20 group relative rounded-md',
          isEditing && 'hover:bg-muted/15'
        )}
      >
        <div className='flex items-start gap-2'>
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline'>
              {format(new Date(createdAt), 'hh:mm')}
            </button>
          </Hint>
          {isEditing ? (
            <div className='w-full h-full'>
              <Editor
                onSubmit={handleUpdate}
                disabled={false}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant='update'
              />
            </div>
          ) : (
            <div className='flex flex-col w-full'>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {isEdited ? (
                <span className='text-xs text-muted-foreground'>(edited)</span>
              ) : null}
            </div>
          )}
        </div>
        {!isEditing && (
          <MessageToolbar
            teamId={teamId}
            messageId={id}
            isAuthor={isAuthor}
            isPending={false}
            handleEdit={() => setEditingId(id)}
            handleThread={() => {}}
            handleReaction={() => {}}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    );

  return (
    <div
      className={cn(
        'flex flex-col gap-2 p-1.5 px-5 hover:bg-muted/20 group relative rounded-md',
        isEditing && 'hover:bg-muted/15'
      )}
    >
      <div className='flex items-start gap-2'>
        <button>
          <Avatar>
            <AvatarImage src={authorImage} />
            <AvatarFallback>{authorName.at(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
        {isEditing ? (
          <div className='w-full h-full'>
            <Editor
              onSubmit={handleUpdate}
              disabled={false}
              defaultValue={JSON.parse(body)}
              onCancel={() => setEditingId(null)}
              variant='update'
            />
          </div>
        ) : (
          <div className='flex flex-col w-full overflow-hidden'>
            <div className='text-sm'>
              <button className='font-bold text-primary hover:underline'>
                {authorName}
              </button>
              <span>&nbsp;&nbsp;</span>
              <Hint label={formatFullTime(new Date(createdAt))}>
                <button className='text-xs text-muted-foreground hover:underline'>
                  {format(new Date(createdAt), 'hh:mm')}
                </button>
              </Hint>
            </div>
            <Renderer value={body} />
            <Thumbnail url={image} />
            {isEdited ? (
              <span className='text-xs text-muted-foreground'>(edited)</span>
            ) : null}
          </div>
        )}
      </div>
      {!isEditing && (
        <MessageToolbar
          teamId={teamId}
          messageId={id}
          isAuthor={isAuthor}
          isPending={false}
          handleEdit={() => setEditingId(id)}
          handleThread={() => {}}
          handleReaction={() => {}}
          hideThreadButton={hideThreadButton}
        />
      )}
    </div>
  );
};

export default Message;
