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
import { useStableQuery } from '../../../../../../../convex/helpers';

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
  searchParams: { priority, status, view = 'board' },
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
  const tasks = useStableQuery(api.tasks.getProjectTasks, {
    teamId,
    projectId,
    filters: {
      priority: priority || undefined,
      status: status || undefined,
    },
  });

  return (
    <TableProvider>
      <section className='w-full'>
        <ProjectFeatureNavbar
          filters={FILTERS}
          views={VIEWS}
          defaultView='board'
          createButtonLabel='New task'
          createModal={<TaskForm />}
        />

        {tasks ? (
          <>
            {view === 'board' ? (
              <TasksBoard tasks={tasks} columns={COLUMNS} />
            ) : (
              <DataTable
                columns={tasksColumns}
                data={tasks}
                DeleteModal={DeleteTasksModal}
              />
            )}
          </>
        ) : (
          <>{view === 'board' ? 'loading' : 'loading'}</>
        )}
      </section>
    </TableProvider>
  );
};

export default ProjectTasksPage;
