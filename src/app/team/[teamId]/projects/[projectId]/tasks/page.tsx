'use client';

import { Columns3, Sheet } from 'lucide-react';

import DeleteTasksModal from './(components)/DeleteTasksModal';
import ProjectFeatureNavbar from '../(components)/ProjectFeatureNavbar';
import TasksBoard from './(components)/TasksBoard';
import TaskForm from './(components)/TaskForm';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { DataTable } from '@/components/ui/data-table';
import { tasksColumns } from './(components)/tasksColumns';
import { TableProvider } from '@/components/TableContext';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { FILTERS } from '@/lib/consts';

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

export const COLUMNS = [
  {
    id: StatusEnum.BACKLOG,
    title: 'Backlog',
  },
  {
    id: StatusEnum.TODO,
    title: 'To Do',
  },
  {
    id: StatusEnum.IN_PROGRESS,
    title: 'In Progress',
  },
  {
    id: StatusEnum.COMPLETED,
    title: 'Completed',
  },
  {
    id: StatusEnum.CANCELED,
    title: 'Canceled',
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
  const { results, isLoading } = useStablePaginatedQuery(
    api.tasks.getProjectTasks,
    {
      teamId,
      projectId,
      filters: {
        priority: priority || undefined,
        status: status || undefined,
      },
    },
    { initialNumItems: 2 }
  );

  return (
    <TableProvider>
      <section className='w-full'>
        <ProjectFeatureNavbar
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
              columns={COLUMNS}
              isLoading={isLoading}
            />
          ) : (
            <DataTable
              columns={tasksColumns}
              data={results}
              isLoading={isLoading}
              DeleteModal={DeleteTasksModal}
            />
          )}
        </>
      </section>
    </TableProvider>
  );
};

export default ProjectTasksPage;
