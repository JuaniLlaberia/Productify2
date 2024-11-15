'use client';

import { Columns3, Sheet, SquareCheckBig } from 'lucide-react';
import { useQuery } from 'convex/react';

import TasksBoard from '../[projectId]/tasks/(components)/TasksBoard';
import ProjectFeatureNavbar from '../[projectId]/(components)/ProjectFeatureNavbar';
import DeleteTasksModal from '../[projectId]/tasks/(components)/DeleteTasksModal';
import { api } from '../../../../../../convex/_generated/api';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { tasksColumns } from '../[projectId]/tasks/(components)/tasksColumns';
import { DataTable } from '@/components/ui/data-table';
import { TableProvider } from '@/components/TableContext';
import { COLUMNS } from '../[projectId]/tasks/page';

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
  {
    label: 'Label',
    field: 'label',
    options: ['Test', 'Test', 'Test'],
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

const MyTasksPage = ({
  params: { teamId },
  searchParams: { priority, status, view = 'board' },
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
  const tasks = useQuery(api.tasks.getUserTasksInTeam, {
    teamId,
    filters: {
      priority,
      status,
    },
  });

  if (!tasks) return <p>Loading</p>;

  return (
    <TableProvider>
      <section className='w-full'>
        <div className='flex items-center gap-2.5 w-full p-2 px-4 border-b border-border'>
          <div className='p-1 rounded bg-muted text-muted-foreground'>
            <SquareCheckBig className='size-4' strokeWidth={1.5} />
          </div>
          <h1 className='text-sm font-medium'>My Tasks</h1>{' '}
        </div>
        <ProjectFeatureNavbar
          filters={FILTERS}
          views={VIEWS}
          defaultView='board'
        />
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
      </section>
    </TableProvider>
  );
};

export default MyTasksPage;
