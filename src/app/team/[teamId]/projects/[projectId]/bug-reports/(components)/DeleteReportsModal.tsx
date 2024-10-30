'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';

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
import { toast } from 'sonner';

type DeleteReportsModalProps = {
  teamId: Id<'teams'>;
  ids: Id<'reports'>[];
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const DeleteReportsModal = ({
  teamId,
  ids,
  onSuccess,
  trigger,
}: DeleteReportsModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deleteReports = useMutation(api.reports.deleteReports);

  const handleDeletion = async () => {
    setIsLoading(true);

    try {
      await deleteReports({ teamId, reporstIds: ids });

      onSuccess?.();
      setIsOpen(false);
    } catch {
      toast.error('Failed to delete report');
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
            {ids.length === 1 ? 'Delete report' : 'Delete all'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Delete {ids.length > 1 ? 'reports' : 'report'}
          </DialogTitle>
          <DialogDescription>
            You are about to delete{' '}
            {ids.length > 1 ? 'these reports' : 'this report'}. All data related
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
            <Button disabled={isLoading} size='sm' variant='outline'>
              Cancel
            </Button>
          </DialogClose>
          <Button
            disabled={isLoading}
            size='sm'
            variant='destructive'
            onClick={handleDeletion}
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

export default DeleteReportsModal;
