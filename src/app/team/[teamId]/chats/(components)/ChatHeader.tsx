import { Hash, X } from 'lucide-react';
import type { ReactElement } from 'react';

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
    <nav className='h-12 flex items-center justify-between w-full p-2 px-4 border-b border-border sticky top-0'>
      <div className='flex items-center gap-2.5'>
        {chatIcon ? chatIcon : <Hash className='size-4' strokeWidth={1.5} />}
        {chatName ? (
          <h1 className='text-sm font-medium'>{chatName}</h1>
        ) : (
          <Skeleton className='h-7 w-32' />
        )}
      </div>
      {onClose ? (
        <Button size='icon' variant='ghost' onClick={onClose}>
          <X className='size-4' strokeWidth={1.5} />
        </Button>
      ) : (
        menu && menu
      )}
    </nav>
  );
};

export default ChatHeader;
