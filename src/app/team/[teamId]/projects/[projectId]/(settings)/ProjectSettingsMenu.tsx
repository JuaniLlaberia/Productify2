'use client';

import { Edit, LogOut, Settings2, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';

import ProjectForm from '../../(components)/ProjectForm';
import DeleteProjectModal from './DeleteProjectModal';
import LeaveProjectModal from './LeaveProjectModal';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Doc, Id } from '../../../../../../../convex/_generated/dataModel';
import { useMemberRole } from '@/features/auth/api/useMemberRole';
import { Skeleton } from '@/components/ui/skeleton';
import ProjectMembers from './ProjectMembers';
import { usePanel } from '../../../(context)/PanelContext';

const ProjectSettingsMenu = ({
  projectData,
}: {
  projectData: Doc<'projects'>;
}) => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const { openPanel, closePanel } = usePanel();

  const { isLoading, isAdmin } = useMemberRole(teamId);
  const hasPermissions = isAdmin;

  const handleMembersSidebar = () => {
    openPanel({
      content: (
        <ProjectMembers projectId={projectData._id} onClose={closePanel} />
      ),
    });
  };

  if (isLoading) return <Skeleton className='h-7 w-32' />;

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <Tooltip>
        <DropdownMenuTrigger asChild>
          <TooltipTrigger>
            <Button size='icon' variant='ghost'>
              <Settings2 className='size-5' strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
        </DropdownMenuTrigger>
        <TooltipContent>Project settings</TooltipContent>
      </Tooltip>
      <DropdownMenuContent side='bottom' align='end'>
        {projectData.private && (
          <DropdownMenuItem onClick={handleMembersSidebar}>
            <Users className='size-4 mr-2' strokeWidth={1.5} />
            Members
          </DropdownMenuItem>
        )}

        {hasPermissions && (
          <>
            <ProjectForm
              teamId={teamId}
              projectData={projectData}
              trigger={
                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                  <Edit className='size-4 mr-2' strokeWidth={1.5} />
                  Edit project
                </DropdownMenuItem>
              }
              onClose={() => setIsDropdownOpen(false)}
            />
            <DropdownMenuSeparator />
          </>
        )}

        <LeaveProjectModal
          teamId={teamId}
          projectId={projectData._id}
          trigger={
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <LogOut className='size-4 mr-2' strokeWidth={1.5} />
              Leave project
            </DropdownMenuItem>
          }
          onSuccess={() => setIsDropdownOpen(false)}
        />

        {hasPermissions && (
          <>
            <DropdownMenuSeparator />
            <DeleteProjectModal
              teamId={teamId}
              projectId={projectData._id}
              projectName={projectData.name}
              trigger={
                <DropdownMenuItem onSelect={e => e.preventDefault()}>
                  <Trash2 className='size-4 mr-2' strokeWidth={1.5} />
                  Delete project
                </DropdownMenuItem>
              }
              onSuccess={() => setIsDropdownOpen(false)}
            />
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProjectSettingsMenu;
