'use client';

import { AlertCircle } from 'lucide-react';
import { useMutation } from 'convex/react';

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { api } from '../../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../../convex/_generated/dataModel';

const DeleteTasksModal = ({
  teamId,
  taskIds,
  onSuccess,
}: {
  teamId: Id<'teams'>;
  taskIds: Id<'tasks'>[];
  onSuccess?: () => void;
}) => {
  const deleteTasks = useMutation(api.tasks.deleteTasks);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          Delete {taskIds.length > 1 ? 'tasks' : 'task'}
        </DialogTitle>
        <DialogDescription>
          You are about to delete{' '}
          {taskIds.length > 1 ? 'these tasks' : 'this task'}. All data related
          will be deleted.
        </DialogDescription>
      </DialogHeader>
      <Alert variant='destructive'>
        <AlertCircle className='size-4' strokeWidth={1.5} />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>This action is not reversible.</AlertDescription>
      </Alert>
      <DialogFooter>
        <DialogClose asChild>
          <Button size='sm' variant='outline'>
            Cancel
          </Button>
        </DialogClose>
        <Button
          size='sm'
          variant='destructive'
          onClick={async () => {
            await deleteTasks({ teamId, taskIds });
            onSuccess?.();
          }}
        >
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default DeleteTasksModal;
