'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { ReactElement, useState } from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type ExpandItemProps = {
  title: string;
  icon: string;
  itemId: string;
  links: {
    label: string;
    link: string;
    icon: string | ReactElement;
  }[];
};

const SidebarExpandItem = ({ title, icon, itemId, links }: ExpandItemProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(pathname.includes(itemId));

  const crrPath = pathname.split('/').at(-1);

  return (
    <li>
      <button
        className='flex items-center justify-between w-full group'
        onClick={() => setIsOpen(prev => !prev)}
      >
        <p className='text-nowrap line-clamp-1'>
          <span
            className={cn(
              'text-sm mr-1.5',
              `${isOpen ? 'bg-muted' : 'group-hover:bg-muted'} px-0.5 py-1 rounded`
            )}
          >
            {icon}
          </span>
          <span className='text-sm'>{title}</span>
        </p>
        <div className='group-hover:bg-muted p-0.5 rounded text-muted-foreground'>
          <ChevronDown
            className={cn(
              'size-4 transition-transform',
              !isOpen && '-rotate-90'
            )}
          />
        </div>
      </button>
      {isOpen ? (
        <ul className=' flex flex-col mt-1'>
          {links.map(link => (
            <li key={link.link}>
              <Link
                href={link.link}
                className={cn(
                  'flex items-center gap-2  pl-4 px-3 py-1.5 rounded-lg text-sm hover:bg-muted',
                  pathname.includes(itemId) &&
                    link.link.split('/').at(-1) === crrPath &&
                    'bg-muted'
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
};

export default SidebarExpandItem;
