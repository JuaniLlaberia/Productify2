'use client';

import { HardDrive, Plus, PlusCircle, Server } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';

import StoragesActions from './StoragesActions';
import InnerSidebarLink from '../../(components)/InnerSidebarLinks';
import StorageForm from './StorageForm';
import UploadAssetModal from './UploadAssetModal';
import SidebarLoader from '../../(components)/SidebarLoader';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { useMemberRole } from '@/features/auth/api/useMemberRole';

const StoragesLinks = () => {
  const pathname = usePathname();
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const { isLoading, isAdmin } = useMemberRole(teamId);
  const hasPermissions = isAdmin;

  const storages = useQuery(api.storages.getUserStorages, { teamId });
  if (!storages || isLoading) return <SidebarLoader />;

  return (
    <>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        <StorageForm
          trigger={
            <button className='flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted'>
              <PlusCircle className='size-4 mr-1.5' strokeWidth={1.5} />
              New storage
            </button>
          }
        />
        <UploadAssetModal
          disabled={/^\/team\/[^/]+\/storages$/.test(pathname)}
        />
        <InnerSidebarLink
          label='Storages'
          icon={<Server className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/storages`}
          isActive={/^\/team\/[^/]+\/storages$/.test(pathname)}
        />
      </ul>

      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2 group'>
        <span className='py-0.5'>Your storages</span>
        <StorageForm
          trigger={
            <span className='hover:bg-muted/40 hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
              <Plus className='size-4' />
            </span>
          }
        />
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        {storages.length > 0 ? (
          storages.map(storage => (
            <InnerSidebarLink
              key={storage?._id}
              icon={
                storage?.icon ? (
                  <span className='size-4 mr-1.5'>{storage.icon}</span>
                ) : (
                  <HardDrive className='size-4 mr-1.5' strokeWidth={1.5} />
                )
              }
              label={storage?.name as string}
              link={`/team/${teamId}/storages/${storage?._id}`}
              isActive={pathname.includes(storage?._id as string)}
              options={storage ? <StoragesActions data={storage} /> : undefined}
            />
          ))
        ) : (
          <div className='flex flex-col items-center'>
            <p className='text-muted-foreground text-sm text-center py-1'>
              No storages found
            </p>
            {hasPermissions && (
              <StorageForm
                trigger={
                  <Button variant='outline' size='sm' className='mt-1'>
                    <Plus className='size-3 mr-1.5' strokeWidth={2} />
                    Create storage
                  </Button>
                }
              />
            )}
          </div>
        )}
      </ul>
    </>
  );
};

export default StoragesLinks;
