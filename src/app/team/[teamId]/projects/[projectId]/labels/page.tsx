'use client';

import { Sheet } from 'lucide-react';

import DeleteLabelsModal from './(components)/DeleteLabelsModal';
import ProjectNavbar from '../(components)/ProjectNavbar';
import LabelsForm from './(components)/LabelsForm';
import { TableProvider } from '@/components/TableContext';
import { DataTable } from '@/components/ui/data-table';
import { labelsColumns } from './(components)/labelsColumns';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { INITIAL_NUM_ITEMS } from '@/lib/consts';

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
  const {
    results,
    isLoading,
    status: queryStatus,
    loadMore,
  } = useStablePaginatedQuery(
    api.labels.getLabels,
    { teamId, projectId },
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  return (
    <TableProvider>
      <section className='w-full'>
        <ProjectNavbar
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
          paginationOpts={{
            canLoadMore: queryStatus === 'CanLoadMore',
            loadMore: () => loadMore(INITIAL_NUM_ITEMS),
          }}
        />
      </section>
    </TableProvider>
  );
};

export default ProjectLabelsPage;
