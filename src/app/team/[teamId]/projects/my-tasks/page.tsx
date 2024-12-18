'use client';

import { Columns3, Sheet, SquareCheckBig } from 'lucide-react';

import TasksBoard from '../[projectId]/tasks/(components)/TasksBoard';
import Header from '@/components/Header';
import ProjectNavbar from '../[projectId]/(components)/ProjectNavbar';
import DeleteTasksModal from '../[projectId]/tasks/(components)/DeleteTasksModal';
import { api } from '../../../../../../convex/_generated/api';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { tasksColumns } from '../[projectId]/tasks/(components)/tasksColumns';
import { DataTable } from '@/components/ui/data-table';
import { TableProvider } from '@/components/TableContext';
import { COLUMNS } from '../[projectId]/tasks/page';
import { FILTERS, INITIAL_NUM_ITEMS } from '@/lib/consts';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';

const VIEWS = [
  {
    id: 'board',
    label: 'Board',
    icon: <Columns3 className='size-4' strokeWidth={1.5} />,
    value: 'board',
  },
  {
    id: 'table',
    label: 'Table',
    icon: <Sheet className='size-4' strokeWidth={1.5} />,
    value: 'table',
  },
];

const MyTasksPage = ({
  params: { teamId },
  searchParams: { priority, status, view },
}: {
  params: {
    teamId: Id<'teams'>;
  };
  searchParams: {
    priority: PriorityEnum;
    status: StatusEnum;
    view: 'board' | 'table';
  };
}) => {
  const {
    results,
    isLoading,
    status: queryStatus,
    loadMore,
  } = useStablePaginatedQuery(
    api.tasks.getUserTasksInTeam,
    {
      teamId,
      filters: {
        priority: priority || undefined,
        status: status || undefined,
      },
    },
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  return (
    <TableProvider>
      <section className='w-full'>
        <Header
          leftContent={
            <>
              <div>
                <SquareCheckBig className='size-4' strokeWidth={1.5} />
              </div>
              <h1 className='text-sm font-medium'>My Tasks</h1>
            </>
          }
        />
        <ProjectNavbar
          filters={[FILTERS.priority, FILTERS.status]}
          views={VIEWS}
          defaultView='table'
        />
        <>
          {view === 'board' ? (
            <TasksBoard
              tasks={results}
              columns={COLUMNS}
              isLoading={isLoading}
            />
          ) : (
            <DataTable
              columns={tasksColumns}
              data={results}
              isLoading={isLoading}
              DeleteModal={DeleteTasksModal}
              paginationOpts={{
                canLoadMore: queryStatus === 'CanLoadMore',
                loadMore: () => loadMore(INITIAL_NUM_ITEMS),
              }}
            />
          )}
        </>
      </section>
    </TableProvider>
  );
};

export default MyTasksPage;
