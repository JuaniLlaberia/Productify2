'use client';

import { useMutation } from 'convex/react';
import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { AlertCircle, Loader2, LogOut } from 'lucide-react';

import SettingsCard from '../../(components)/SettingsCard';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const LeaveTeamModal = () => {
  const router = useRouter();
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const leaveTeam = useMutation(api.teams.leaveTeam);

  const handleLeaveTeam = async () => {
    setIsLoading(true);

    try {
      await leaveTeam({ teamId });
      router.push('/team/select');
    } catch {
      toast.error('Failed to leave this team', {
        description: 'Please try again in a few minutes.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SettingsCard
      variant='danger'
      title='Leave team'
      description='You will leave this team and lose access to it.'
      footerMsg='You can leave and re-join a team if you are invited back.'
    >
      <Dialog>
        <DialogTrigger>
          <Button variant='destructive'>
            <LogOut
              className='size-4 mr-1.5'
              strokeWidth={1.5}
            />
            Leave team
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave team</DialogTitle>
            <DialogDescription>
              You are about to leave this team.
            </DialogDescription>
          </DialogHeader>
          <Alert variant='informative'>
            <AlertCircle
              className='size-4'
              strokeWidth={1.5}
            />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              You will lose access to the team. You can re-join if invited back.
            </AlertDescription>
          </Alert>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='outline'
                disabled={isLoading}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              disabled={isLoading}
              size='sm'
              variant='destructive'
              onClick={handleLeaveTeam}
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
    </SettingsCard>
  );
};

export default LeaveTeamModal;
