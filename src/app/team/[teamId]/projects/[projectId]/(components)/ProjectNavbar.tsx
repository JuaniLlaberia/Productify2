'use client';

import { Edit, LogOut, Settings, Trash2, Users } from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';

const ProjectNavbar = () => {
  const pathname = usePathname();
  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();

  const projectData = useQuery(api.projects.getProjectById, {
    teamId,
    projectId,
  });

  return (
    <div className='flex items-center justify-between w-full p-2 px-4 border-b border-border'>
      <Breadcrumb>
        <BreadcrumbList>
          <div className='p-1 rounded bg-muted text-muted-foreground'>
            {projectData?.icon}
          </div>
          <BreadcrumbItem>Projects</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{projectData?.name}</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem className='capitalize'>
            {pathname.split('/').at(-1)}
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
          <DropdownMenuItem>
            <Users className='size-4 mr-2' strokeWidth={1.5} />
            Members
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Edit className='size-4 mr-2' strokeWidth={1.5} />
            Edit project
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2 className='size-4 mr-2' strokeWidth={1.5} />
            Delete project
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className='size-4 mr-2' strokeWidth={1.5} />
            Leave project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProjectNavbar;
