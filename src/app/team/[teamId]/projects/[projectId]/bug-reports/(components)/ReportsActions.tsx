'use client';

import { Copy, Edit, MoreHorizontal, SendToBack, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useState } from 'react';

import DeleteReportsModal from './DeleteReportsModal';
import ReportsForm from './ReportsForm';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '../../../../../../../../convex/_generated/api';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Doc } from '../../../../../../../../convex/_generated/dataModel';

const ReportsActions = ({ data }: { data: Doc<'reports'> }) => {
  // Dialog states
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [removeDialog, setRemoveDialog] = useState<boolean>(false);

  // Duplicate functionality
  const createReport = useMutation(api.reports.createReport);
  const handleDuplicateTask = async () => {
    const promise = createReport({
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      teamId: data.teamId,
      projectId: data.projectId,
    });

    toast.promise(promise, {
      loading: 'Duplicating report',
      success: 'Report duplicated successfully',
      error: 'Failed to duplicate report',
    });
  };

  // Transform into task functionality
  const createTask = useMutation(api.tasks.createTask);
  const handleTransformToTask = () => {
    const promise = createTask({
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: 'backlog',
      teamId: data.teamId,
      projectId: data.projectId,
      isSubTask: false,
      dueDate: new Date().getTime(),

      // assignee: data.assignee?._id,
      // label: data.label?._id,
    });

    toast.promise(promise, {
      loading: 'Transforming report into task',
      success: 'Report transformed successfully',
      error: 'Failed to transform report',
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
            Edit report
          </DropdownMenuItem>
          {/* Transform to task button */}
          <DropdownMenuItem className='text-xs' onClick={handleTransformToTask}>
            <SendToBack className='size-3 mr-2' strokeWidth={1.5} />
            Transform to task
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
            Delete report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Dialogs */}
      {/* Edit */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent>
          <ReportsForm />
        </DialogContent>
      </Dialog>
      {/* Remove */}
      <Dialog open={removeDialog} onOpenChange={setRemoveDialog}>
        <DeleteReportsModal teamId={data.teamId} ids={[data._id]} />
      </Dialog>
    </>
  );
};

export default ReportsActions;
