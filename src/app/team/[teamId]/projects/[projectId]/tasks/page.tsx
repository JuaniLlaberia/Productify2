'use client';

import { Columns3, Sheet } from 'lucide-react';

import DeleteTasksModal from './(components)/DeleteTasksModal';
import ProjectNavbar from '../(components)/ProjectNavbar';
import TasksBoard from './(components)/TasksBoard';
import TaskForm from './(components)/TaskForm';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { DataTable } from '@/components/ui/data-table';
import { tasksColumns } from './(components)/tasksColumns';
import { TableProvider } from '@/components/TableContext';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { COLUMNS, FILTERS, INITIAL_NUM_ITEMS } from '@/lib/consts';

const VIEWS = [
  {
    id: 'board',
    label: 'Board',
    icon: (
      <Columns3
        className='size-4'
        strokeWidth={1.5}
      />
    ),
    value: 'board',
  },
  {
    id: 'table',
    label: 'Table',
    icon: (
      <Sheet
        className='size-4'
        strokeWidth={1.5}
      />
    ),
    value: 'table',
  },
];

const ProjectTasksPage = ({
  params: { teamId, projectId },
  searchParams: { priority, status, view },
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
  const {
    results,
    isLoading,
    status: queryStatus,
    loadMore,
  } = useStablePaginatedQuery(
    api.tasks.getProjectTasks,
    {
      teamId,
      projectId,
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
        <ProjectNavbar
          filters={[FILTERS.priority, FILTERS.status]}
          views={VIEWS}
          defaultView='table'
          createButtonLabel='New task'
          createModal={<TaskForm />}
        />

        <>
          {view === 'board' ? (
            <TasksBoard
              tasks={results}
              columns={[...COLUMNS]}
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
                isLoadingMore: queryStatus === 'LoadingMore',
                loadMore: () => loadMore(INITIAL_NUM_ITEMS),
              }}
            />
          )}
        </>
      </section>
    </TableProvider>
  );
};

export default ProjectTasksPage;
