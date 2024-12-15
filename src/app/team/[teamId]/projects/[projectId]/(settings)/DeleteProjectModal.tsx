'use client';

import { CircleAlert, LucideLoader2, Trash2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useState } from 'react';

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
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';
import { Input } from '@/components/ui/input';

type DeleteProjectModalProps = {
  teamId: Id<'teams'>;
  projectId: Id<'projects'>;
  projectName: string;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
};

const DeleteProjectModal = ({
  teamId,
  projectId,
  projectName,
  onSuccess,
  trigger,
}: DeleteProjectModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const router = useRouter();
  const deleteProject = useMutation(api.projects.deleteProject);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit(async () => {
    try {
      await deleteProject({ teamId, projectId });

      onSuccess?.();
      router.push(`/team/${teamId}/projects/my-tasks`);
      toast.success('Project deleted successfully');
      setIsOpen(false);
    } catch {
      toast.error('Failed to delete toast');
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm' variant='destructive'>
            <Trash2 className='size-4 mr-1.5' strokeWidth={1.5} />
            Delete project
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>
            You are about to delete this project. All data related will be
            deleted.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className='flex flex-col gap-4'>
          <div>
            <label
              htmlFor='name'
              className='text-sm text-muted-foreground mb-1.5'
            >
              Enter the project name{' '}
              <span className='text-primary font-semibold'>{projectName}</span>{' '}
              to continue:
            </label>
            <Input
              id='name'
              type='text'
              placeholder='Proyect name'
              {...register('name', {
                validate: {
                  validator: (fieldVal: string) =>
                    fieldVal === projectName
                      ? true
                      : 'Please confirm project name',
                },
              })}
            />
            {errors.name?.message ? (
              <p className='text-sm text-red-500 px-1'>
                {errors.name?.message as string}
              </p>
            ) : null}
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
                <LucideLoader2 className='size-4 mr-1.5 animate-spin' />
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

export default DeleteProjectModal;
