import Link from 'next/link';
import type { ReactElement } from 'react';

import { cn } from '@/lib/utils';
import { Doc } from '../../../../../../convex/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ConversationLinkProps = {
  user: Doc<'users'> | null;
  link: string;
  isActive: boolean;
  options?: ReactElement;
};

const ConversationLink = ({
  user,
  link,
  isActive,
  options,
}: ConversationLinkProps) => {
  return (
    <li>
      <Link
        href={link}
        className={cn(
          'flex items-center justify-between px-2 py-1.5 rounded-lg text-sm hover:bg-muted/60 group',
          isActive && 'bg-muted/60'
        )}
      >
        <span className='flex items-center gap-2'>
          <Avatar className='size-6 mr-1.5'>
            <AvatarFallback className='size-6 mr-1.5'>
              {user?.fullName.at(0)?.toUpperCase() || 'M'}
            </AvatarFallback>
            <AvatarImage src={user?.profileImage} />
          </Avatar>
          {user?.fullName || 'Member'}
        </span>
        {options && (
          <div className='opacity-100 md:opacity-0 md:[&:has([data-state="open"])]:opacity-100 group-hover:opacity-100'>
            {options}
          </div>
        )}
      </Link>
    </li>
  );
};

export default ConversationLink;
