'use client';

import { Copy, Edit, MoreHorizontal, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useState } from 'react';

import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PopulatedTask } from './tasksColumns';
import { api } from '../../../../../../../../convex/_generated/api';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import DeleteTasksModal from './DeleteTasksModal';

const TasksActions = ({ data }: { data: PopulatedTask }) => {
  // Dialog states
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [removeDialog, setRemoveDialog] = useState<boolean>(false);
  // Duplicate functionality
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
      isSubTask: false,
    });

    toast.promise(promise, {
      loading: 'Duplicating task',
      success: 'Task duplicated successfully',
      error: 'Failed to duplicate task',
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='size-6 p-0 hover:bg-gray-200'>
            <span className='sr-only'>Open menu</span>
            <MoreHorizontal
              className='size-4 text-muted-foreground'
              strokeWidth={1.5}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          {/* Edit button */}
          <DropdownMenuItem
            className='text-xs'
            onClick={() => setEditDialog(true)}
          >
            <Edit className='size-3 mr-2' strokeWidth={1.5} />
            Edit task
          </DropdownMenuItem>
          {/* Duplicate button */}
          <DropdownMenuItem className='text-xs' onClick={handleDuplicateTask}>
            <Copy className='size-3 mr-2' strokeWidth={1.5} />
            Duplicate
          </DropdownMenuItem>
          {/* Remove button */}
          <DropdownMenuItem
            className='text-xs'
            onClick={() => setRemoveDialog(true)}
          >
            <Trash2 className='size-3 mr-2' strokeWidth={1.5} />
            Delete task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      {/* Edit */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <TaskForm taskData={data} />
        </DialogContent>
      </Dialog>
      {/* Remove */}
      <Dialog open={removeDialog} onOpenChange={setRemoveDialog}>
        <DeleteTasksModal teamId={data.teamId} ids={[data._id]} />
      </Dialog>
    </>
  );
};

export default TasksActions;
