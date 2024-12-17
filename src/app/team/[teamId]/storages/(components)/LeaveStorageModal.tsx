'use client';

import { AlertCircle, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';

type LeaveStorageProps = {
  teamId: Id<'teams'>;
  storageId: Id<'storages'>;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const LeaveStorageModal = ({
  teamId,
  storageId,
  onSuccess,
  trigger,
}: LeaveStorageProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const leaveStorage = useMutation(api.storages.leaveStorage);

  const handleLeaveChannel = async () => {
    setIsLoading(true);

    try {
      await leaveStorage({ teamId, storageId });

      onSuccess?.();
      setIsOpen(false);
      toast.success('Storage left successfully');
      router.push(`/team/${teamId}/storages`);
    } catch {
      toast.error('Failed to leave storage');
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
            Leave storage
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave storage</DialogTitle>
          <DialogDescription>
            You are about to leave this storage.
          </DialogDescription>
        </DialogHeader>
        <Alert variant='informative'>
          <AlertCircle className='size-4' strokeWidth={1.5} />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            You can re-join after leaving. It&apos;s not permanent.
          </AlertDescription>
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
            onClick={handleLeaveChannel}
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

export default LeaveStorageModal;
