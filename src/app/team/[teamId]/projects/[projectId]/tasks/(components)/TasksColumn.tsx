import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';

import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import Badge, { ColorsType } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatusEnum } from '@/lib/enums';
import { STATUS_COLORS } from '@/lib/consts';
import { PopulatedTask } from './tasksColumns';

type TasksColumnType = {
  status: StatusEnum;
  tasks: PopulatedTask[];
};

const TasksColumn = ({ status, tasks }: TasksColumnType) => {
  const { setNodeRef } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  });

  return (
    <li className='flex flex-col h-full w-full min-w-[280px] max-w-[350px]'>
      <header className='flex justify-between items-center py-2 min-h-12 group'>
        <div className='flex items-center gap-2'>
          <Badge
            text={status}
            color={STATUS_COLORS[status] as ColorsType}
            decorated
          />
          <p className='font-medium text-muted-foreground'>
            {tasks.length || 0}
          </p>
        </div>
        <TaskForm
          taskData={{ status } as PopulatedTask}
          trigger={
            <Button
              variant='ghost'
              size='icon'
              className='md:hidden md:group-hover:flex'
            >
              <Plus className='size-4' />
            </Button>
          }
        />
      </header>
      <SortableContext
        items={tasks.map(task => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <ul ref={setNodeRef} className='flex flex-col gap-2 min-h-[200px] p-1'>
          {tasks.length > 0 ? (
            tasks.map(task => <TaskCard taskData={task} key={task._id} />)
          ) : (
            <TaskForm
              trigger={
                <Button variant='ghost' size='sm' className='justify-start'>
                  <Plus className='size-4 mr-1.5' />
                  Add task
                </Button>
              }
              taskData={{ status } as PopulatedTask}
            />
          )}
        </ul>
      </SortableContext>
    </li>
  );
};

export default TasksColumn;
