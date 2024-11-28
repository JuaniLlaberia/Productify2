'use client';

import { useParams, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import ProjectSettingsMenu from '../(settings)/ProjectSettingsMenu';
import { Skeleton } from '@/components/ui/skeleton';

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

  if (!projectData)
    return (
      <div className='flex items-center justify-between w-full p-2 px-4 border-b border-border'>
        <Skeleton className='h-8 w-32' />
        <Skeleton className='h-8 w-32' />
      </div>
    );

  return (
    <div className='flex h-12 items-center justify-between w-full p-2 px-4 border-b border-border'>
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
      <ProjectSettingsMenu projectData={projectData} />
    </div>
  );
};

export default ProjectNavbar;
