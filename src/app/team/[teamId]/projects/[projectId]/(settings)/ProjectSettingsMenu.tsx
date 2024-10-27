'use client';

import { Edit, LogOut, Settings, Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { useParams } from 'next/navigation';

import ProjectForm from '../../(components)/ProjectForm';
import DeleteProjectModal from './DeleteProjectModal';
import LeaveProjectModal from './LeaveProjectModal';
import ProjectMembers from './ProjectMembers';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Doc, Id } from '../../../../../../../convex/_generated/dataModel';

const ProjectSettingsMenu = ({
  projectData,
}: {
  projectData: Doc<'projects'>;
}) => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const [membersDialog, setMembersDialog] = useState<boolean>(false);
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [removeDialog, setRemoveDialog] = useState<boolean>(false);
  const [leaveDialog, setLeaveDialog] = useState<boolean>(false);

  console.log(projectData);

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <DropdownMenuTrigger asChild>
            <TooltipTrigger>
              <Button size='sm' variant='outline'>
                <Settings className='size-4 mr-1.5' strokeWidth={1.5} />
                Settings
              </Button>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <TooltipContent>Project settings</TooltipContent>
        </Tooltip>
        <DropdownMenuContent side='bottom' align='end'>
          {projectData.private ? (
            <DropdownMenuItem onClick={() => setMembersDialog(true)}>
              <Users className='size-4 mr-2' strokeWidth={1.5} />
              Members
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem onClick={() => setEditDialog(true)}>
            <Edit className='size-4 mr-2' strokeWidth={1.5} />
            Edit project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setRemoveDialog(true)}>
            <Trash2 className='size-4 mr-2' strokeWidth={1.5} />
            Delete project
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLeaveDialog(true)}>
            <LogOut className='size-4 mr-2' strokeWidth={1.5} />
            Leave project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {projectData.private ? (
        <Dialog open={membersDialog} onOpenChange={setMembersDialog}>
          <DialogContent>
            <ProjectMembers />
          </DialogContent>
        </Dialog>
      ) : null}

      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <ProjectForm teamId={teamId} projectData={projectData} />
        </DialogContent>
      </Dialog>

      <Dialog open={removeDialog} onOpenChange={setRemoveDialog}>
        <DeleteProjectModal
          teamId={teamId}
          projectId={projectData._id}
          projectName={projectData.name}
        />
      </Dialog>

      <Dialog open={leaveDialog} onOpenChange={setLeaveDialog}>
        <LeaveProjectModal teamId={teamId} projectId={projectData._id} />
      </Dialog>
    </>
  );
};

export default ProjectSettingsMenu;
