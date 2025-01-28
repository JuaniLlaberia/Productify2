'use client';

import { Hash, MessagesSquare, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';

import ChannelForm from '../channels/(components)/ChannelForm';
import ConversationForm from '../conversations/(components)/ConversationForm';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMemberRole } from '@/features/auth/api/useMemberRole';
import { Id } from '../../../../../../convex/_generated/dataModel';

const NewChatBtn = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const { isAdmin } = useMemberRole(teamId);

  const hasPermissions = isAdmin;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button className='flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted/60 data-[state=open]:bg-muted/60'>
          <PlusCircle className='size-4 mr-1.5' strokeWidth={1.5} />
          New chat
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='start'>
        {hasPermissions && (
          <ChannelForm
            onClose={() => setIsOpen(false)}
            trigger={
              <DropdownMenuItem
                onSelect={e => e.preventDefault()}
                className='data-[state=open]:bg-muted/60'
              >
                <Hash className='size-4 mr-2' />
                New channel
              </DropdownMenuItem>
            }
          />
        )}
        <ConversationForm
          onClose={() => setIsOpen(false)}
          trigger={
            <DropdownMenuItem
              onSelect={e => e.preventDefault()}
              className='data-[state=open]:bg-muted/60'
            >
              <MessagesSquare className='size-4 mr-2' />
              New conversation
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NewChatBtn;
