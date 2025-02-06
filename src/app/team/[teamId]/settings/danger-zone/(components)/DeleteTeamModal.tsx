'use client';

import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CircleAlert, Loader2, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';

import SettingsCard from '../../(components)/SettingsCard';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { useMemberRole } from '@/features/auth/api/useMemberRole';

const DeleteTeamModal = ({ teamName }: { teamName: string }) => {
  const router = useRouter();
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const { isAdmin } = useMemberRole(teamId);
  const deleteTeam = useMutation(api.teams.deleteTeam);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleDeleteTeam = handleSubmit(async () => {
    try {
      await deleteTeam({ teamId });
      router.push('/team/select');
    } catch {
      toast.error('Failed to delete this team', {
        description: 'Please try again in a few minutes.',
      });
    }
  });

  if (!isAdmin) return null;

  return (
    <SettingsCard
      variant='danger'
      title='Delete team'
      description='Permanently remove this Team and all of its contents from Productify.'
      footerMsg='This action is not reversible.'
    >
      <Dialog>
        <DialogTrigger>
          <Button variant='destructive'>
            <Trash2
              className='size-4 mr-1.5'
              strokeWidth={1.5}
            />
            Delete team
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete team</DialogTitle>
            <DialogDescription>
              You are about to delete this team. All data related will be
              deleted.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleDeleteTeam}
            className='flex flex-col gap-4'
          >
            <div>
              <label
                htmlFor='name'
                className='text-sm text-muted-foreground mb-1.5'
              >
                Enter the team name{' '}
                <span className='text-primary font-semibold'>{teamName}</span>{' '}
                to continue:
              </label>
              <Input
                id='name'
                type='text'
                placeholder='Team name'
                {...register('name', {
                  validate: {
                    validator: (fieldVal: string) =>
                      fieldVal === teamName ? true : 'Please confirm team name',
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
                <Button
                  disabled={isSubmitting}
                  variant='outline'
                  size='sm'
                >
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
    </SettingsCard>
  );
};

export default DeleteTeamModal;
