'use client';

import { useQuery } from 'convex/react';
import {
  Bug,
  Ellipsis,
  Folder,
  Folders,
  LayoutPanelTop,
  Plus,
  PlusCircle,
  SquareCheckBig,
  Tags,
} from 'lucide-react';
import { useParams, usePathname } from 'next/navigation';

import ProjectForm from './ProjectForm';
import InnerSidebarLink from '../../(components)/InnerSidebarLinks';
import SidebarLoader from '../../(components)/SidebarLoader';
import SidebarExpandItemV2 from '../../(components)/SidebarExpandItemV2';
import ProjectSettingsMenu from '../[projectId]/(settings)/ProjectSettingsMenu';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { Button } from '@/components/ui/button';
import { useMemberRole } from '@/features/auth/api/useMemberRole';

const ProjectsLinks = () => {
  const pathname = usePathname();
  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();
  const projects = useQuery(api.projects.getProjects, {
    teamId,
  });

  const { isLoading, isAdmin } = useMemberRole(teamId);
  const hasPermissions = isAdmin;

  if (!projects || isLoading) return <SidebarLoader />;

  const reUsableUrl = `/team/${teamId}/projects`;

  return (
    <>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>General</span>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        {hasPermissions && (
          <ProjectForm
            trigger={
              <button className='flex w-full items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-muted'>
                <PlusCircle className='size-4 mr-1.5' strokeWidth={1.5} />
                New project
              </button>
            }
          />
        )}
        <InnerSidebarLink
          label='My taks'
          icon={<SquareCheckBig className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/projects/my-tasks`}
          isActive={pathname.includes('my-tasks')}
        />
        <InnerSidebarLink
          label='All projects'
          icon={<Folders className='size-4 mr-1.5' strokeWidth={1.5} />}
          link={`/team/${teamId}/projects`}
          isActive={/^\/team\/[^/]+\/projects$/.test(pathname)}
        />
      </ul>

      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2 group'>
        <span className='py-0.5'>Your projects</span>
        {hasPermissions && (
          <ProjectForm
            trigger={
              <button className='hover:bg-muted hidden group-hover:flex p-0.5 rounded transition-colors cursor-pointer'>
                <Plus className='size-4' />
              </button>
            }
          />
        )}
      </h3>
      <ul className='space-y-2.5'>
        {projects.length > 0 ? (
          projects.map(project => (
            <SidebarExpandItemV2
              key={project?._id}
              id={project!._id}
              title={project?.name as string}
              icon={
                project?.icon ? (
                  project.icon
                ) : (
                  <Folder className='size-4' strokeWidth={1.5} />
                )
              }
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
              ].map(link => (
                <InnerSidebarLink
                  key={link.link}
                  label={link.label}
                  icon={link.icon}
                  link={link.link}
                  isActive={pathname.includes(link.link)}
                  className='pl-6'
                />
              ))}
              expandIcon
              options={
                <ProjectSettingsMenu
                  projectData={project!}
                  trigger={
                    <Button size='icon-sm' variant='ghost'>
                      <Ellipsis className='size-4' />
                    </Button>
                  }
                />
              }
            />
          ))
        ) : (
          <div className='flex flex-col items-center'>
            <p className='text-muted-foreground text-sm text-center py-1'>
              No projects found
            </p>
            {hasPermissions && (
              <ProjectForm
                trigger={
                  <Button variant='outline' size='sm' className='mt-1'>
                    <Plus className='size-3 mr-1.5' strokeWidth={2} />
                    Create project
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

export default ProjectsLinks;
