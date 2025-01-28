import { Hash, X } from 'lucide-react';
import type { ReactElement } from 'react';

import Header from '@/components/Header';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

type ChatHeaderProps = {
  chatName?: string;
  chatIcon?: string | ReactElement;
  menu?: ReactElement;
  onClose?: () => void;
};

const ChatHeader = ({ chatIcon, chatName, menu, onClose }: ChatHeaderProps) => {
  return (
    <Header
      leftContent={
        <div className='flex items-center gap-2.5'>
          {chatIcon ? chatIcon : <Hash className='size-4' strokeWidth={1.5} />}
          {chatName ? (
            <h1 className='text-sm font-medium'>{chatName}</h1>
          ) : (
            <Skeleton className='h-7 w-32' />
          )}
        </div>
      }
      rightContent={
        onClose ? (
          <Button size='icon' variant='ghost' onClick={onClose}>
            <X className='size-4' strokeWidth={1.5} />
          </Button>
        ) : (
          menu && menu
        )
      }
    />
  );
};

export default ChatHeader;
