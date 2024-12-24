'use client';

import { UserPlus, X } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

import Header from '@/components/Header';
import AddMembersModal from '../../../(components)/AddMembersModal';
import MembersLoader from '../../../(components)/MembersLoader';
import MembersTable from '../../../(components)/MembersTable';
import { Button } from '@/components/ui/button';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';

type ChannelMembersProps = {
  channelId: Id<'channels'>;
  onClose: () => void;
};

const ChannelMembers = ({ channelId, onClose }: ChannelMembersProps) => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const members = useQuery(api.channels.getChannelMembers, {
    teamId,
    channelId,
  });

  //Add members to a channel functionality
  const addMembersToChannel = useMutation(api.channels.createChannelMembers);
  const handleAddMember = async (userIds: Id<'users'>[]) => {
    await addMembersToChannel({
      channelId,
      teamId,
      userIds,
    });
  };

  //Remove member from a channel functionality
  const deleteMemberFromChannel = useMutation(api.channels.removeChannelMember);
  const handleDeleteMember = async (channelMember: Id<'channelMembers'>) => {
    await deleteMemberFromChannel({ teamId, channelMember });
  };

  if (!members)
    return (
      <div className='h-full flex flex-col space-y-2'>
        <Header
          leftContent={<p className='text-sm'>Channel members</p>}
          rightContent={
            <Button onClick={onClose} variant='ghost' size='icon'>
              <X className='size-4' strokeWidth={1.5} />
            </Button>
          }
        />
        <MembersLoader />
      </div>
    );

  const existingMembers = members?.map(member => member?._id);

  return (
    <div className='h-full flex flex-col space-y-2'>
      <Header
        leftContent={<p className='text-sm'>Channel members</p>}
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
            description='Select members to add to this channel.'
          />
        </div>
        <MembersTable members={members} memberDeleteFn={handleDeleteMember} />
      </div>
    </div>
  );
};

export default ChannelMembers;
