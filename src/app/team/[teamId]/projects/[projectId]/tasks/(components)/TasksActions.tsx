'use client';

import { Copy, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useState } from 'react';

import TaskForm from './TaskForm';
import DeleteTasksModal from './DeleteTasksModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PopulatedTask } from './tasksColumns';
import { api } from '../../../../../../../../convex/_generated/api';

const TasksActions = ({ data }: { data: PopulatedTask }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const createTask = useMutation(api.tasks.createTask);

  const handleDuplicateTask = async () => {
    const promise = createTask({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee?._id,
      dueDate: data.dueDate,
      label: data.label?._id,
      teamId: data.teamId,
      projectId: data.projectId,
    });

    toast.promise(promise, {
      loading: 'Duplicating task',
      success: 'Task duplicated successfully',
      error: 'Failed to duplicate task',
    });
  };

  return (
    <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='size-6 p-0 hover:bg-muted'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal
            className='size-4 text-muted-foreground'
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        onClick={e => {
          e.stopPropagation();
        }}
      >
        <TaskForm
          taskData={data}
          trigger={
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Edit className='size-3.5 mr-2' strokeWidth={1.5} />
              Edit task
            </DropdownMenuItem>
          }
          onClose={() => setIsDropdownOpen(false)}
        />
        <DropdownMenuItem onClick={handleDuplicateTask}>
          <Copy className='size-3.5 mr-2' strokeWidth={1.5} />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DeleteTasksModal
          teamId={data.teamId}
          ids={[data._id]}
          trigger={
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <Trash2 className='size-3.5 mr-2' strokeWidth={1.5} />
              Delete task
            </DropdownMenuItem>
          }
          onSuccess={() => setIsDropdownOpen(false)}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TasksActions;
