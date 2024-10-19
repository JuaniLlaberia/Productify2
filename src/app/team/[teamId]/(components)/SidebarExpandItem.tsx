'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { ReactElement, useState } from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

type ExpandItemProps = {
  title: string;
  icon: string | ReactElement;
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
          <span className='text-sm mr-1.5'>{icon}</span>
          <span>{title}</span>
        </p>
        <div className='group-hover:bg-gray-200 p-0.5 rounded text-muted-foreground'>
          <ChevronDown
            className={cn(
              'size-4 transition-transform',
              !isOpen ? '-rotate-90' : null
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
                  'flex items-center gap-2  pl-4 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200',
                  pathname.includes(itemId) &&
                    link.link.split('/').at(-1) === crrPath
                    ? 'bg-gray-200'
                    : null
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
