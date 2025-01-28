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

type ProjectMembersProps = {
  projectId: Id<'projects'>;
  onClose: () => void;
};

const ProjectMembers = ({ projectId, onClose }: ProjectMembersProps) => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const members = useQuery(api.projects.getProjectMembers, {
    teamId,
    projectId,
  });

  const addMembersToChannel = useMutation(api.projects.createProjectMember);
  const handleAddMember = async (userIds: Id<'users'>[]) => {
    await addMembersToChannel({
      projectId,
      teamId,
      userIds,
    });
  };

  const deleteMemberFromChannel = useMutation(api.projects.removeProjectMember);
  const handleDeleteMember = async (projectMember: Id<'projectMembers'>) => {
    await deleteMemberFromChannel({ teamId, projectMember });
  };

  if (!members)
    return (
      <div className='h-full flex flex-col space-y-2'>
        <Header
          leftContent={<p className='text-sm'>Project members</p>}
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
        leftContent={<p className='text-sm'>Project members</p>}
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
          />
        </div>
        <MembersTable members={members} memberDeleteFn={handleDeleteMember} />
      </div>
    </div>
  );
};

export default ProjectMembers;
