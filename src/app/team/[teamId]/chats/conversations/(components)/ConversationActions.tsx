'use client';

import Link from 'next/link';
import { Expand, MoreHorizontal, PanelRight, Trash2 } from 'lucide-react';
import { useState } from 'react';

import DeleteConversationModal from './DeleteConversationModal';
import Conversation from './Conversation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { usePanel } from '../../../(context)/PanelContext';

type ConversationActionsProps = {
  teamId: Id<'teams'>;
  conversationId: Id<'conversations'>;
};

const ConversationActions = ({
  teamId,
  conversationId,
}: ConversationActionsProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { openPanel, closePanel } = usePanel();

  const handleConversationSidebar = () => {
    openPanel({
      content: (
        <Conversation
          key={conversationId}
          teamId={teamId}
          conversationId={conversationId}
          onClose={closePanel}
        />
      ),
    });
  };

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
        <DropdownMenuItem className='text-sm' asChild>
          <Link href={`/team/${teamId}/conversations/${conversationId}`}>
            <Expand className='size-3.5 mr-2' strokeWidth={1.5} />
            Open
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className='text-sm'
          onClick={handleConversationSidebar}
        >
          <PanelRight className='size-3.5 mr-2' strokeWidth={1.5} />
          View in sidebar
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteConversationModal
          teamId={teamId}
          conversationId={conversationId}
          trigger={
            <DropdownMenuItem
              className='text-sm'
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
