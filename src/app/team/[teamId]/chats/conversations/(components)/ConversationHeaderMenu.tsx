'use client';

import { PanelRight, Settings2, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import Hint from '@/components/ui/hint';
import Conversation from './Conversation';
import DeleteConversationModal from './DeleteConversationModal';
import { Button } from '@/components/ui/button';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { usePanel } from '../../../(context)/PanelContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ConversationHeaderMenu = ({
  conversationId,
}: {
  conversationId: Id<'conversations'>;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
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
    <ul className='flex gap-2'>
      <li>
        <Hint label='Open in sidebar'>
          <Button
            size='icon'
            variant='ghost'
            onClick={handleConversationSidebar}
          >
            <PanelRight className='size-5' strokeWidth={1.5} />
          </Button>
        </Hint>
      </li>
      <li>
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger>
            <Hint label='Settings'>
              <Button size='icon' variant='ghost'>
                <Settings2 className='size-5' strokeWidth={1.5} />
              </Button>
            </Hint>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
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
      </li>
    </ul>
  );
};

export default ConversationHeaderMenu;
