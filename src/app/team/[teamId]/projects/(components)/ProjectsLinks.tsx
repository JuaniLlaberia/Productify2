'use client';

import { useQuery } from 'convex/react';
import {
  Bug,
  LayoutPanelTop,
  Plus,
  PlusCircle,
  SquareCheckBig,
  Tags,
} from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

import SidebarExpandItem from '../../(components)/SidebarExpandItem';
import ProjectForm from './ProjectForm';
import InnerSidebarLink from '../../(components)/InnerSidebarLinks';
import SidebarLoader from '../../(components)/SidebarLoader';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

const ProjectsLinks = () => {
  const pathname = usePathname();
  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();
  const projects = useQuery(api.projects.getProjects, {
    teamId,
  });
  if (!projects) return <SidebarLoader />;

  const reUsableUrl = `/team/${teamId}/projects`;

  return (
    <Dialog>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        <DialogTrigger asChild>
          <button className='flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted'>
            <PlusCircle className='size-4 mr-1.5' strokeWidth={1.5} />
            New project
          </button>
        </DialogTrigger>
        <InnerSidebarLink
          label='My taks'
          icon={<SquareCheckBig className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/projects/my-tasks`}
          isActive={pathname.includes('my-tasks')}
        />
      </ul>

      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2 group'>
        <span className='py-0.5'>Your projects</span>
        <DialogTrigger asChild>
          <span className='hover:bg-muted hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
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
              icon={project?.icon as string}
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
                  label: 'Reports',
                  icon: <Bug className='size-4 mr-1.5' strokeWidth={1.5} />,
                  link: `${reUsableUrl}/${project?._id}/bug-reports`,
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
        <ProjectForm teamId={teamId as Id<'teams'>} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectsLinks;
