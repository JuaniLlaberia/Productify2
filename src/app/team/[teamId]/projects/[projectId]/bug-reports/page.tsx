'use client';

import { Sheet } from 'lucide-react';

import DeleteReportsModal from './(components)/DeleteReportsModal';
import ProjectNavbar from '../(components)/ProjectNavbar';
import ReportsForm from './(components)/ReportsForm';
import { TableProvider } from '@/components/TableContext';
import { PriorityEnum, ReportTypeEnum } from '@/lib/enums';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';
import { DataTable } from '@/components/ui/data-table';
import { reportsColumns } from './(components)/reportsColumns';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { FILTERS, INITIAL_NUM_ITEMS } from '@/lib/consts';

const VIEWS = [
  {
    id: 'table',
    label: 'Table',
    icon: <Sheet className='size-4' strokeWidth={1.5} />,
    value: 'table',
  },
];

const ProjectBugReportsPage = ({
  params: { teamId, projectId },
  searchParams: { priority, type },
}: {
  params: {
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  };
  searchParams: {
    priority: PriorityEnum;
    type: ReportTypeEnum;
    view: 'board' | 'table';
  };
}) => {
  const {
    results,
    isLoading,
    status: queryStatus,
    loadMore,
  } = useStablePaginatedQuery(
    api.reports.getProjectReports,
    {
      teamId,
      projectId,
      filters: { priority, type },
    },
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  return (
    <TableProvider>
      <section className='w-full'>
        <ProjectNavbar
          filters={[FILTERS.priority, FILTERS.type]}
          views={VIEWS}
          defaultView='table'
          createButtonLabel='New report'
          createModal={<ReportsForm />}
        />
        <DataTable
          columns={reportsColumns}
          data={results}
          isLoading={isLoading}
          DeleteModal={DeleteReportsModal}
          paginationOpts={{
            canLoadMore: queryStatus === 'CanLoadMore',
            isLoadingMore: queryStatus === 'LoadingMore',
            loadMore: () => loadMore(INITIAL_NUM_ITEMS),
          }}
        />
      </section>
    </TableProvider>
  );
};

export default ProjectBugReportsPage;
