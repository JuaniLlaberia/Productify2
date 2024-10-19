'use client';

import Link from 'next/link';
import { useQuery } from 'convex/react';
import {
  LayoutPanelTop,
  ListChecks,
  Plus,
  SquareCheckBig,
  Tags,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

import SidebarExpandItem from '../../(components)/SidebarExpandItem';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import ProjectForm from './ProjectForm';
import { cn } from '@/lib/utils';

const ProjectsLinks = ({ teamId }: { teamId: Id<'teams'> }) => {
  const pathname = usePathname();
  const projects = useQuery(api.projects.getProjects, { teamId });
  if (!projects)
    return (
      <ul className='flex flex-col gap-2'>
        <li>
          <Skeleton className='w-full h-6' />
        </li>
        <li>
          <Skeleton className='w-full h-6' />
        </li>
        <li>
          <Skeleton className='w-full h-6' />
        </li>
        <li>
          <Skeleton className='w-full h-6' />
        </li>
        <li>
          <Skeleton className='w-full h-6' />
        </li>
      </ul>
    );

  const reUsableUrl = `/team/${teamId}/projects`;

  return (
    <>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        <li>
          <Link
            href={`/team/${teamId}/projects/my-tasks`}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200',
              pathname.includes('my-tasks') ? 'bg-gray-200' : null
            )}
          >
            <SquareCheckBig className='size-4 mr-1.5' strokeWidth={1.5} />
            My tasks
          </Link>
        </li>
        <li>
          <Link
            href={`/team/${teamId}/projects/all-tasks`}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200',
              pathname.includes('all-tasks') ? 'bg-gray-200' : null
            )}
          >
            <ListChecks className='size-4 mr-1.5' strokeWidth={1.5} />
            All tasks
          </Link>
        </li>
      </ul>

      <Dialog>
        <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2 group'>
          <span className='py-0.5'>Your projects</span>
          <DialogTrigger asChild>
            <span className='hover:bg-gray-200 hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
              <Plus className='size-4' />
            </span>
          </DialogTrigger>
        </h3>
        <ul className='space-y-2.5'>
          {projects.length > 0 ? (
            projects.map(project => (
              <SidebarExpandItem
                key={project?._id}
                title={project?.name as string}
                itemId={project?._id as string}
                icon='😎'
                links={[
                  {
                    label: 'Tasks',
                    icon: (
                      <SquareCheckBig
                        className='size-4 mr-1.5'
                        strokeWidth={1.5}
                      />
                    ),
                    link: `${reUsableUrl}/${project?._id}/tasks`,
                  },
                  {
                    label: 'Templates',
                    icon: (
                      <LayoutPanelTop
                        className='size-4 mr-1.5'
                        strokeWidth={1.5}
                      />
                    ),
                    link: `${reUsableUrl}/${project?._id}/templates`,
                  },
                  {
                    label: 'Labels',
                    icon: <Tags className='size-4 mr-1.5' strokeWidth={1.5} />,
                    link: `${reUsableUrl}/${project?._id}/labels`,
                  },
                ]}
              />
            ))
          ) : (
            <div className='flex flex-col items-center'>
              <p className='text-muted-foreground text-sm text-center py-1'>
                No projects found
              </p>
              <DialogTrigger asChild>
                <Button variant='outline' size='sm' className='mt-1'>
                  <Plus className='size-3 mr-1.5' strokeWidth={2} />
                  Create project
                </Button>
              </DialogTrigger>
            </div>
          )}
        </ul>
        <DialogContent>
          <ProjectForm teamId={teamId} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProjectsLinks;
