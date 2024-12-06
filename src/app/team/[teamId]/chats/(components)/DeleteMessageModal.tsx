'use client';

import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { Button } from '@/components/ui/button';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';

type DeleteMessageModalProps = {
  teamId: Id<'teams'>;
  messageId: Id<'messages'>;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const DeleteMessageModal = ({
  teamId,
  messageId,
  onSuccess,
  trigger,
}: DeleteMessageModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deleteMessage = useMutation(api.messages.deleteMessage);

  const handleDeletion = async () => {
    setIsLoading(true);

    try {
      await deleteMessage({ teamId, messageId });

      onSuccess?.();
      toast.success('Message deleted successfully');
      setIsOpen(false);
    } catch {
      toast.error('Failed to delete message');
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
            Delete message
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete message</DialogTitle>
          <DialogDescription>
            You are about to delete this message.
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

export default DeleteMessageModal;
