'use client';

import { Sheet } from 'lucide-react';

import ProjectNavbar from '../(components)/ProjectNavbar';
import DeleteTemplatesModal from './(components)/DeleteTemplatesModal';
import TemplatesForm from './(components)/TemplatesForm';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { api } from '../../../../../../../convex/_generated/api';
import { TableProvider } from '@/components/TableContext';
import { DataTable } from '@/components/ui/data-table';
import { templatesColumns } from './(components)/templatesColumns';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { FILTERS } from '@/lib/consts';

const VIEWS = [
  {
    id: 'table',
    label: 'Table',
    icon: <Sheet className='size-4' strokeWidth={1.5} />,
    value: 'table',
  },
];

const ProjectTemplatesPage = ({
  params: { teamId, projectId },
  searchParams: { priority, status },
}: {
  params: {
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  };
  searchParams: {
    priority: PriorityEnum;
    status: StatusEnum;
    view: 'board' | 'table';
  };
}) => {
  const { results, isLoading } = useStablePaginatedQuery(
    api.templates.getProjectTemplates,
    {
      teamId,
      projectId,
      filters: { priority, status },
    },
    { initialNumItems: 10 }
  );

  return (
    <TableProvider>
      <section className='w-full'>
        <ProjectNavbar
          filters={[FILTERS.priority, FILTERS.status]}
          views={VIEWS}
          defaultView='table'
          createButtonLabel='New template'
          createModal={<TemplatesForm />}
        />

        <DataTable
          columns={templatesColumns}
          data={results}
          isLoading={isLoading}
          DeleteModal={DeleteTemplatesModal}
        />
      </section>
    </TableProvider>
  );
};

export default ProjectTemplatesPage;
