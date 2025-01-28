'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { api } from '../../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../../convex/_generated/dataModel';

type DeleteLabelsModalProps = {
  teamId: Id<'teams'>;
  ids: Id<'labels'>[];
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const DeleteLabelsModal = ({
  teamId,
  ids,
  onSuccess,
  trigger,
}: DeleteLabelsModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deleteLabels = useMutation(api.labels.deleteLabels);

  const handleDeletion = async () => {
    setIsLoading(true);

    try {
      await deleteLabels({ teamId, labelsIds: ids });

      onSuccess?.();
      setIsOpen(false);
    } catch {
      toast.error('Failed to delete label');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm' variant='destructive'>
            <Trash2 className='size-4 mr-1.5' strokeWidth={1.5} />
            {ids.length === 1 ? 'Delete label' : 'Delete all'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {ids.length > 1 ? 'labels' : 'label'}
          </DialogTitle>
          <DialogDescription>
            You are about to delete{' '}
            {ids.length > 1 ? 'these labels' : 'this label'}. All data related
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
            <Button size='sm' variant='outline' disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            size='sm'
            variant='destructive'
            onClick={handleDeletion}
            className='min-w-16'
          >
            {isLoading ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              'Confirm'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteLabelsModal;
