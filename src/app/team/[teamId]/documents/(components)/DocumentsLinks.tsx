'use client';

import { useParams, usePathname } from 'next/navigation';
import { FolderPlus, Folders, Plus } from 'lucide-react';

import InnerSidebarLink from '../../(components)/InnerSidebarLinks';
import CabinetForm from './CabinetForm';
import CabinetsList from './CabinetsList';
import { Id } from '../../../../../../convex/_generated/dataModel';

const DocumentsLinks = () => {
  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();
  const pathname = usePathname();

  return (
    <>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <ul>
        <CabinetForm
          trigger={
            <button className='flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted'>
              <FolderPlus className='size-4 mr-1.5' strokeWidth={1.5} />
              New cabinet
            </button>
          }
        />
        <InnerSidebarLink
          label='All cabinets'
          icon={<Folders className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/documents/cabinets`}
          isActive={pathname.includes('/cabinets')}
        />
      </ul>

      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mt-4 mb-2 group'>
        <span className='py-0.5'>Cabinets</span>
        <CabinetForm
          trigger={
            <span
              onClick={() => {}}
              className='hover:bg-muted/40 hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'
            >
              <Plus className='size-4' />
            </span>
          }
        />
      </h3>
      <CabinetsList />
    </>
  );
};

export default DocumentsLinks;
