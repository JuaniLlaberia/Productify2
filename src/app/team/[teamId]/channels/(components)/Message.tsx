import dynamic from 'next/dynamic';
import { format, isToday, isYesterday } from 'date-fns';

import Thumbnail from '@/components/ui/thumbnail';
import Hint from '@/components/ui/hint';
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Renderer = dynamic(() => import('@/components/Renderer'), { ssr: false });

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesturday' : format(date, 'MMM d, yyyy')} at ${format(date, 'hh:mm:ss a')}`;
};

type MessageProps = {
  id: Id<'messages'>;
  memberId?: Id<'members'>;
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

const Message = ({
  id,
  isAuthor,
  memberId,
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
  if (isCompact)
    return (
      <div className='flex flex-col gap-2 p-1.5 px-5 hover:bg-muted/20 group relative'>
        <div className='flex items-start gap-2'>
          <Hint label={formatFullTime(new Date(createdAt))}>
            <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline'>
              {format(new Date(createdAt), 'hh:mm')}
            </button>
          </Hint>
          <div className='flex flex-col w-full'>
            <Renderer value={body} />
            <Thumbnail url={image} />
            {isEdited ? (
              <span className='text-xs text-muted-foreground'>(edited)</span>
            ) : null}
          </div>
        </div>
      </div>
    );

  return (
    <div className='flex flex-col gap-2 p-1.5 px-5 hover:bg-muted/20 group relative'>
      <div className='flex items-start gap-2'>
        <button>
          <Avatar>
            <AvatarImage src={authorImage} />
            <AvatarFallback>{authorName.at(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
        </button>
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
      </div>
    </div>
  );
};

export default Message;
