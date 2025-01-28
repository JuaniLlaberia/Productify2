'use client';

import { Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';

type RemoveMemberModalProps = {
  teamId: Id<'teams'>;
  memberId: Id<'members'>;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const RemoveMemberModal = ({
  teamId,
  memberId,
  onSuccess,
  trigger,
}: RemoveMemberModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const removeMember = useMutation(api.teams.deleteMember);

  const handleRemoveMember = async () => {
    setIsLoading(true);

    try {
      await removeMember({ teamId, memberToDelete: memberId });
      onSuccess?.();
    } catch {
      toast.error('Failed to remove member');
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
            Remove member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Remove member</DialogTitle>
          <DialogDescription>
            You are about to remove this member.
          </DialogDescription>
        </DialogHeader>
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
            onClick={handleRemoveMember}
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

export default RemoveMemberModal;
