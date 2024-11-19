import Link from 'next/link';
import type { ReactElement } from 'react';

import { cn } from '@/lib/utils';

type InnerSidebarLinkProps = {
  label: string;
  icon: string | ReactElement;
  link: string;
  isActive: boolean;
  options?: ReactElement;
};

const InnerSidebarLink = ({
  label,
  icon,
  link,
  isActive,
  options,
}: InnerSidebarLinkProps) => {
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
          {icon}
          {label}
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

export default InnerSidebarLink;
