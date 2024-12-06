import { MessageSquareText, Pencil, Smile, Trash2 } from 'lucide-react';

import Hint from '@/components/ui/hint';
import DeleteMessageModal from './DeleteMessageModal';
import { Button } from '@/components/ui/button';
import { EmojiPopover } from '@/components/ui/emoji-popover';
import { Id } from '../../../../../../convex/_generated/dataModel';

type ToolbarProps = {
  teamId: Id<'teams'>;
  messageId: Id<'messages'>;
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
};

export const MessageToolbar = ({
  teamId,
  messageId,
  isAuthor,
  isPending,
  handleEdit,
  handleReaction,
  handleThread,
  hideThreadButton,
}: ToolbarProps) => {
  return (
    <div className='absolute top-0 right-5'>
      <div className='group-hover:opacity-100 opacity-0 transition-opacity border border-border rounded-lg p-0.5 bg-muted/20 shadow-sm'>
        <EmojiPopover
          onEmojiSelect={emoji => handleReaction(emoji.native)}
          hint='Add reaction'
        >
          <Button variant='ghost' size='icon' disabled={isPending}>
            <Smile className='size-4' strokeWidth={1.5} />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label='Reply in thread'>
            <Button
              variant='ghost'
              size='icon'
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareText className='size-4' strokeWidth={1.5} />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label='Edit message'>
            <Button
              variant='ghost'
              size='icon'
              disabled={isPending}
              onClick={handleEdit}
            >
              <Pencil className='size-4' strokeWidth={1.5} />
            </Button>
          </Hint>
        )}
        {isAuthor && (
          <Hint label='Delete message'>
            <DeleteMessageModal
              teamId={teamId}
              messageId={messageId}
              trigger={
                <Button variant='ghost' size='icon' disabled={isPending}>
                  <Trash2 className='size-4' strokeWidth={1.5} />
                </Button>
              }
            />
          </Hint>
        )}
      </div>
    </div>
  );
};
