'use client';

import { AlertCircle, Loader2, LogOut } from 'lucide-react';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';

type LeaveProjectModalProps = {
  teamId: Id<'teams'>;
  projectId: Id<'projects'>;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const LeaveProjectModal = ({
  teamId,
  projectId,
  onSuccess,
  trigger,
}: LeaveProjectModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const leaveProject = useMutation(api.projects.leaveProject);
  const handleLeave = async () => {
    setIsLoading(true);
    try {
      await leaveProject({ teamId, projectId });

      onSuccess?.();
      router.push(`/team/${teamId}/projects/my-tasks`);
      toast.success('You left the project successfully');
      setIsOpen(false);
    } catch {
      toast.error('Failed to leave the project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm' variant='destructive'>
            <LogOut className='size-4 mr-1.5' strokeWidth={1.5} />
            Leave project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave project</DialogTitle>
          <DialogDescription>
            You are about to leave this project. You will lose access to all
            related data.
          </DialogDescription>
        </DialogHeader>
        <Alert variant='informative'>
          <AlertCircle className='size-4' strokeWidth={1.5} />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            You can re-join the project if you are invited back.
          </AlertDescription>
        </Alert>
        <DialogFooter>
          <DialogClose asChild>
            <Button size='sm' variant='outline' disabled={isLoading}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            size='sm'
            variant='destructive'
            disabled={isLoading}
            onClick={handleLeave}
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

export default LeaveProjectModal;
