'use client';

import { useParams, usePathname } from 'next/navigation';
import { useQuery } from 'convex/react';

import Header from '@/components/Header';
import ProjectSettingsMenu from '../(settings)/ProjectSettingsMenu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { Skeleton } from '@/components/ui/skeleton';

const ProjectHeader = () => {
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
    <Header
      leftContent={
        projectData ? (
          <Breadcrumb>
            <BreadcrumbList>
              <div>{projectData?.icon}</div>
              <BreadcrumbItem>Projects</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{projectData?.name}</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='capitalize'>
                {pathname.split('/').at(-1)}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        ) : (
          <Skeleton className='h-8 w-32' />
        )
      }
      rightContent={
        projectData ? (
          <ProjectSettingsMenu projectData={projectData} />
        ) : (
          <Skeleton className='h-8 w-32' />
        )
      }
    />
  );
};

export default ProjectHeader;
