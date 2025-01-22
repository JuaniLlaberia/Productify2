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

type LeaveChannelProps = {
  teamId: Id<'teams'>;
  cabinetId: Id<'cabinets'>;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const LeaveCabinetModal = ({
  teamId,
  cabinetId,
  onSuccess,
  trigger,
}: LeaveChannelProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const leaveCabinet = useMutation(api.cabinets.leaveCabinet);

  const handleLeaveCabinet = async () => {
    setIsLoading(true);

    try {
      await leaveCabinet({ teamId, cabinetId });

      onSuccess?.();
      setIsOpen(false);
      toast.success('Cabinet left successfully');
      router.push(`/team/${teamId}/documents/cabinets`);
    } catch {
      toast.error('Failed to leave cabinet');
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
            Leave cabinet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave cabinet</DialogTitle>
          <DialogDescription>
            You are about to leave this cabinet.
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
            onClick={handleLeaveCabinet}
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

export default LeaveCabinetModal;
