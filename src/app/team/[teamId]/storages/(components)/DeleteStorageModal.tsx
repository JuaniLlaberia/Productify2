'use client';

import { CircleAlert, Loader2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';

type DeleteStorageModalProps = {
  teamId: Id<'teams'>;
  storageId: Id<'storages'>;
  storageName?: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const DeleteStorageModal = ({
  teamId,
  storageId,
  storageName,
  onSuccess,
  trigger,
}: DeleteStorageModalProps) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const deleteStorage = useMutation(api.storages.deleteStorage);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleDeletion = handleSubmit(async () => {
    try {
      await deleteStorage({ teamId, storageId });

      onSuccess?.();
      setIsOpen(false);

      router.push(`/team/${teamId}/storages`);
      toast.success('Storage deleted successfully');
    } catch {
      toast.error('Failed to delete storage');
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm' variant='destructive'>
            <Trash2 className='size-4 mr-1.5' strokeWidth={1.5} />
            Delete storage
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete storage</DialogTitle>
          <DialogDescription>
            You are about to delete this storage. All data related will be
            deleted.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleDeletion} className='flex flex-col gap-4'>
          <div>
            <label
              htmlFor='name'
              className='text-sm text-muted-foreground mb-1.5'
            >
              Enter the storage name{' '}
              <span className='text-primary font-semibold'>
                {storageName || 'Storage'}
              </span>{' '}
              to continue:
            </label>
            <Input
              id='name'
              type='text'
              placeholder='Storage name'
              {...register('name', {
                validate: {
                  validator: (fieldVal: string) =>
                    fieldVal === storageName || 'storage'
                      ? true
                      : 'Please confirm storage name',
                },
              })}
            />
            {errors.name?.message && (
              <p className='text-sm text-red-500 px-1'>
                {errors.name?.message as string}
              </p>
            )}
          </div>
          <Alert variant='destructive'>
            <AlertTitle className='flex items-center gap-2 mb-0'>
              <CircleAlert className='size-4' />
              Warning. This action is not reversible
            </AlertTitle>
          </Alert>
          <div className='flex justify-between mt-2'>
            <DialogClose asChild>
              <Button disabled={isSubmitting} variant='outline' size='sm'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isSubmitting}
              size='sm'
              variant='destructive'
              className='min-w-16'
            >
              {isSubmitting ? (
                <Loader2 className='size-4 mr-1.5 animate-spin' />
              ) : (
                'Confirm'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteStorageModal;
