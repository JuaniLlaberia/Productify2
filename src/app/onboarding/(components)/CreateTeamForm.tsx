'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { newTeamSchema } from '@/lib/validators';
import { api } from '../../../../convex/_generated/api';
import { completeClerkOnboarding } from '../_actions';

const CreateTeamForm = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ resolver: zodResolver(newTeamSchema) });
  const createTeam = useMutation(api.teams.createTeam);
  const router = useRouter();
  const { user } = useUser();

  const submitHandler = handleSubmit(async data => {
    try {
      const res = await completeClerkOnboarding();
      const teamId = await createTeam({ name: data.name });

      if (res.message && teamId) {
        await user?.reload();

        router.push(`/team/${teamId}`);
        toast.success('Team created successfully');
      }
    } catch {
      toast.error('Failed to create team');
    }
  });

  return (
    <form className='space-y-6' onSubmit={submitHandler}>
      <div>
        <Label htmlFor='name'>Team name</Label>
        <Input
          id='name'
          placeholder='Your team name'
          maxLength={30}
          {...register('name')}
        />
        <p className='flex items-center justify-between text-muted-foreground text-sm px-2 mt-1'>
          <span>Name can be change later</span>
          <span>{(watch('name') || '').length}/30</span>
        </p>
      </div>
      <Alert variant='destructive'>
        <div className='flex items-center gap-2'>
          <AlertCircle className='h-4 w-4' />
          <AlertDescription>Team name is a required field</AlertDescription>
        </div>
      </Alert>
      <Button className='w-full' disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className='animate-spin size-4 mr-1.5' />
        ) : (
          'Create team'
        )}
      </Button>
    </form>
  );
};

export default CreateTeamForm;
