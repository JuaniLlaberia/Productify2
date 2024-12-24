'use client';

import { UserPlus, X } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

import Header from '@/components/Header';
import AddMembersModal from '../../(components)/AddMembersModal';
import MembersTable from '../../(components)/MembersTable';
import MembersLoader from '../../(components)/MembersLoader';
import { Button } from '@/components/ui/button';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';

type StorageMembersProps = {
  storageId: Id<'storages'>;
  onClose: () => void;
};

const StorageMembers = ({ storageId, onClose }: StorageMembersProps) => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const members = useQuery(api.storages.getStorageMembers, {
    teamId,
    storageId,
  });

  const addMembersToStorage = useMutation(api.storages.createStorageMembers);
  const handleAddMember = async (userIds: Id<'users'>[]) => {
    await addMembersToStorage({
      storageId,
      teamId,
      userIds,
    });
  };

  const deleteMemberFromStorage = useMutation(api.storages.removeStorageMember);
  const handleDeleteMember = async (storageMember: Id<'storagesMembers'>) => {
    await deleteMemberFromStorage({ teamId, storageMember });
  };

  if (!members)
    return (
      <div className='h-full flex flex-col space-y-2'>
        <Header
          leftContent={<p className='text-sm'>Storage members</p>}
          rightContent={
            <Button onClick={onClose} variant='ghost' size='icon'>
              <X className='size-4' strokeWidth={1.5} />
            </Button>
          }
        />
        <MembersLoader />
      </div>
    );

  const existingMembers = members?.map(member => member._id);

  return (
    <div className='h-full flex flex-col space-y-2'>
      <Header
        leftContent={<p className='text-sm'>Storage members</p>}
        rightContent={
          <Button onClick={onClose} variant='ghost' size='icon'>
            <X className='size-4' strokeWidth={1.5} />
          </Button>
        }
      />

      <div className='p-2.5'>
        <div className='flex items-center justify-between'>
          <p className='text-muted-foreground text-sm'>
            Total members: {members.length}
          </p>
          <AddMembersModal
            existingMembers={existingMembers}
            onSubmit={handleAddMember}
            trigger={
              <Button size='sm'>
                <UserPlus className='size-4 mr-1.5' />
                Add members
              </Button>
            }
            description='Select members to add to this storage.'
          />
        </div>
        <MembersTable members={members} memberDeleteFn={handleDeleteMember} />
      </div>
    </div>
  );
};

export default StorageMembers;
