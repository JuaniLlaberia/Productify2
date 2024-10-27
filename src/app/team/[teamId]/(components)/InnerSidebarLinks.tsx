import Link from 'next/link';
import type { ReactElement } from 'react';

import { cn } from '@/lib/utils';

type InnerSidebarLinkProps = {
  label: string;
  icon: string | ReactElement;
  link: string;
  isActive: boolean;
};

const InnerSidebarLink = ({
  label,
  icon,
  link,
  isActive,
}: InnerSidebarLinkProps) => {
  return (
    <li>
      <Link
        href={link}
        className={cn(
          'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted',
          isActive ? 'bg-muted' : null
        )}
      >
        {icon}
        {label}
      </Link>
    </li>
  );
};

export default InnerSidebarLink;
