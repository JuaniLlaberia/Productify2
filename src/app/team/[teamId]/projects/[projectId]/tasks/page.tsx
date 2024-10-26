'use client';

import { Columns3, Plus, Sheet } from 'lucide-react';
import { useQuery } from 'convex/react';

import DeleteTasksModal from './(components)/DeleteTasksModal';
import ProjectsNavbar from '../(components)/Navbar';
import TaskForm from './(components)/TaskForm';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { DataTable } from '@/components/ui/data-table';
import { tasksColumns } from './(components)/columns';
import { TableProvider } from '@/components/TableContext';
import { Button } from '@/components/ui/button';

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
  const tasks = useQuery(api.tasks.getProjectTasks, {
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
        <ProjectsNavbar
          filters={FILTERS}
          views={[
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
          ]}
          defaultView='board'
          createButtonLabel='New task'
          createModal={<TaskForm />}
        />

        {tasks ? (
          <>
            {view === 'board' ? (
              <>board</>
            ) : (
              <DataTable
                columns={tasksColumns}
                data={tasks}
                DeleteModal={DeleteTasksModal}
                footerModal={<TaskForm />}
                footerModalTrigger={
                  <Button
                    size='sm'
                    variant='ghost'
                    className='text-muted-foreground'
                  >
                    <Plus className='size-4 mr-1.5' strokeWidth={2} />
                    Add task
                  </Button>
                }
              />
            )}
          </>
        ) : (
          'loading'
        )}
      </section>
    </TableProvider>
  );
};

export default ProjectTasksPage;
