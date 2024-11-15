'use client';

import { Sheet } from 'lucide-react';

import DeleteLabelsModal from './(components)/DeleteLabelsModal';
import ProjectFeatureNavbar from '../(components)/ProjectFeatureNavbar';
import LabelsForm from './(components)/LabelsForm';
import { TableProvider } from '@/components/TableContext';
import { DataTable } from '@/components/ui/data-table';
import { labelsColumns } from './(components)/labelsColumns';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';

const VIEWS = [
  {
    id: 'table',
    label: 'Table',
    icon: <Sheet className='size-4' strokeWidth={1.5} />,
    value: 'table',
  },
];

const ProjectLabelsPage = ({
  params: { teamId, projectId },
}: {
  params: {
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  };
}) => {
  const { results, isLoading } = useStablePaginatedQuery(
    api.labels.getLabels,
    { teamId, projectId },
    { initialNumItems: 10 }
  );

  return (
    <TableProvider>
      <section className='w-full'>
        <ProjectFeatureNavbar
          views={VIEWS}
          defaultView='table'
          createButtonLabel='New label'
          createModal={<LabelsForm />}
        />
        <DataTable
          columns={labelsColumns}
          data={results}
          isLoading={isLoading}
          DeleteModal={DeleteLabelsModal}
        />
      </section>
    </TableProvider>
  );
};

export default ProjectLabelsPage;
