'use client';

import { Folder, Folders } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

import InnerSidebarLink from '../../(components)/InnerSidebarLinks';

const AssetsLinks = () => {
  const pathname = usePathname();
  const { teamId } = useParams();

  return (
    <>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        <InnerSidebarLink
          label='My assets'
          icon={<Folder className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/my-assets`}
          isActive={pathname.includes('my-assets')}
        />
        <InnerSidebarLink
          label='Team assets'
          icon={<Folders className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/assets`}
          isActive={pathname.includes('assets')}
        />
      </ul>
    </>
  );
};

export default AssetsLinks;
