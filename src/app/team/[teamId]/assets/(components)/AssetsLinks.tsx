'use client';

import Link from 'next/link';
import { Folder, Folders } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

const AssetsLinks = () => {
  const pathname = usePathname();
  const { teamId } = useParams();

  return (
    <>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        <li>
          <Link
            href={`/team/${teamId}/my-assets`}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200',
              pathname.includes('my-assets') ? 'bg-gray-200' : null
            )}
          >
            <Folder className='size-4 mr-1.5' strokeWidth={1.5} />
            My assets
          </Link>
        </li>
        <li>
          <Link
            href={`/team/${teamId}/assets`}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200',
              pathname.includes('all-tasks') ? 'bg-gray-200' : null
            )}
          >
            <Folders className='size-4 mr-1.5' strokeWidth={1.5} />
            Team assets
          </Link>
        </li>
      </ul>
    </>
  );
};

export default AssetsLinks;
