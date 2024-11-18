'use client';

import { useQuery } from 'convex/react';
import { SmilePlus } from 'lucide-react';

import Hint from '@/components/ui/hint';
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';
import { cn } from '@/lib/utils';
import { EmojiPopover } from '@/components/ui/emoji-popover';

type ReactionsProps = {
  data: Array<
    Omit<Doc<'reactions'>, 'userId'> & {
      count: number;
      userIds: Id<'users'>[];
    }
  >;
  onChange: (value: string) => void;
};

export const Reactions = ({ data, onChange }: ReactionsProps) => {
  const user = useQuery(api.users.getUser);

  if (data.length === 0 || !user?._id) return null;

  return (
    <div className='flex items-center gap-1 mt-1 mb-1'>
      {data.map(reaction => (
        <Hint
          key={reaction._id}
          label={`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`}
        >
          <button
            onClick={() => onChange(reaction.value)}
            className={cn(
              'h-6 px-2 rounded-full bg-muted/10 border border-transparent flex items-center gap-1',
              reaction.userIds.includes(user._id) &&
                'bg-blue-200/65 border-blue-700/30 dark:border-blue-700/65 dark:bg-blue-900/30'
            )}
          >
            {reaction.value}
            <span
              className={cn(
                'text-xs font-semibold text-muted-foreground',
                reaction.userIds.includes(user._id) && 'text-primary'
              )}
            >
              {reaction.count}
            </span>
          </button>
        </Hint>
      ))}
      <EmojiPopover
        hint='Add reaction'
        onEmojiSelect={emoji => onChange(emoji.native)}
      >
        <button className='h-7 px-3 rounded-full border border-border hover:bg-muted transition-all'>
          <SmilePlus className='size-3.5' strokeWidth={1.5} />
        </button>
      </EmojiPopover>
    </div>
  );
};
