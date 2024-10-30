'use client';

import { List, Sheet } from 'lucide-react';
import { useQuery } from 'convex/react';

import ProjectFeatureNavbar from '../(components)/ProjectFeatureNavbar';
import DeleteTemplatesModal from './(components)/DeleteTemplatesModal';
import TemplatesForm from './(components)/TemplatesForm';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { api } from '../../../../../../../convex/_generated/api';
import { TableProvider } from '@/components/TableContext';
import { DataTable } from '@/components/ui/data-table';
import { templatesColumns } from './(components)/templatesColumns';

const FILTERS = [
  {
    label: 'Priority',
    field: 'priority',
    options: ['low', 'medium', 'high', 'urgent'],
  },
  {
    label: 'Status',
    field: 'status',
    options: ['backlog', 'todo', 'in-progress', 'completed', 'canceled'],
  },
];

const VIEWS = [
  {
    id: 'table',
    label: 'Table',
    icon: <Sheet className='size-4' strokeWidth={1.5} />,
    value: 'table',
  },
  {
    id: 'list',
    label: 'List',
    icon: <List className='size-4' strokeWidth={1.5} />,
    value: 'list',
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
  const templates = useQuery(api.templates.getProjectTemplates, {
    teamId,
    projectId,
    filters: { priority, status },
  });

  if (!templates) return <p>Loading</p>;

  return (
    <TableProvider>
      <section className='w-full'>
        <ProjectFeatureNavbar
          filters={FILTERS}
          views={VIEWS}
          defaultView='table'
          createButtonLabel='New template'
          createModal={<TemplatesForm />}
        />
        <DataTable
          columns={templatesColumns}
          data={templates}
          DeleteModal={DeleteTemplatesModal}
        />
      </section>
    </TableProvider>
  );
};

export default ProjectTemplatesPage;
