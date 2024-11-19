'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactElement } from 'react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type SidebarLinkProps = {
  label: string;
  tooltip: string;
  link: string;
  activeKey: string;
  icon: ReactElement;
};

const SidebarLink = ({
  link,
  activeKey,
  label,
  tooltip,
  icon,
}: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname.includes(activeKey);

  return (
    <Tooltip key={link}>
      <TooltipTrigger asChild>
        <Link
          href={link}
          className='flex flex-col items-center rounded-lg group'
        >
          <span
            className={cn(
              'size-10 flex items-center justify-center rounded-lg group-hover:bg-muted transition-all',
              isActive && 'bg-muted'
            )}
          >
            {icon}
          </span>
          <span className='text-center text-xs font-medium'>{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right' sideOffset={6}>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default SidebarLink;
