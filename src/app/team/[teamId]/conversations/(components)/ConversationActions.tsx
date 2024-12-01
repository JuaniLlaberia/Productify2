'use client';

import { MoreHorizontal, Trash2 } from 'lucide-react';
import { useState } from 'react';

import DeleteConversationModal from './DeleteConversationModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Id } from '../../../../../../convex/_generated/dataModel';

type ConversationActionsProps = {
  teamId: Id<'teams'>;
  conversationId: Id<'conversations'>;
};

const ConversationActions = ({
  teamId,
  conversationId,
}: ConversationActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='size-5 p-0 hover:bg-muted'
        >
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal
            className='size-4 text-muted-foreground'
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <DeleteConversationModal
          teamId={teamId}
          conversationId={conversationId}
          trigger={
            <DropdownMenuItem
              className='text-xs'
              onSelect={e => e.preventDefault()}
            >
              <Trash2 className='size-3.5 mr-2' strokeWidth={1.5} />
              Delete conversation
            </DropdownMenuItem>
          }
          onSuccess={() => setIsDropdownOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConversationActions;
