'use client';

import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import InputWrapper from '@/components/ui/input-wrapper';
import { api } from '../../../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ProjectSchema } from '@/lib/validators';
import { Id } from '../../../../../../convex/_generated/dataModel';

const ProjectForm = ({ teamId }: { teamId: Id<'teams'> }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', public: false, autojoin: false },
    resolver: zodResolver(ProjectSchema),
  });
  const router = useRouter();

  const createProject = useMutation(api.projects.createProject);

  const submitHandler = handleSubmit(async data => {
    try {
      const projectId = await createProject({
        teamId,
        projectData: {
          name: data.name,
          public: data.public,
          autojoin: data.autojoin,
        },
      });

      router.push(`${projectId}/tasks`);
      toast.success('Project created successfully');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error('Failed to create project');
    }
  });

  return (
    <form onSubmit={submitHandler} className='space-y-5'>
      <DialogHeader>
        <DialogTitle>Create project</DialogTitle>
        <DialogDescription>
          A projects represents work-spaces, teams, or groups, each with its own
          tasks, templates, labels and features.
        </DialogDescription>
      </DialogHeader>
      <fieldset className='space-y-4'>
        <div className='flex items-end gap-1.5'>
          <InputWrapper
            label='Name & Icon'
            error={errors.name?.message as string}
            inputId='name'
            className='w-full'
          >
            <Input
              id='name'
              placeholder='e.g. Front-End, Research, HR'
              {...register('name')}
            />
          </InputWrapper>
          <button className='flex items-center justify-center text-muted-foreground size-10 rounded-lg border border-input bg-transparent cursor-pointer hover:text-primary transition-all'>
            <span className='sr-only'>Select icon</span>
            <Plus className='size-4' />
          </button>
        </div>
        <div className='flex items-center justify-between py-1'>
          <div className='flex flex-col'>
            <Label>Make private</Label>
            <p className='text-sm text-muted-foreground'>
              Only members will see it
            </p>
          </div>
          <Controller
            control={control}
            name='public'
            render={({ field: { onChange, value } }) => (
              <Switch onCheckedChange={onChange} checked={value} />
            )}
          />
        </div>
        <div className='flex items-center justify-between py-1'>
          <div className='flex flex-col'>
            <Label>Auto join</Label>
            <p className='text-sm text-muted-foreground'>
              Automatically join new members to this project
            </p>
          </div>
          <Controller
            control={control}
            name='autojoin'
            render={({ field: { onChange, value } }) => (
              <Switch onCheckedChange={onChange} checked={value} />
            )}
          />
        </div>
        <Alert variant='destructive'>
          <AlertCircle className='size-4' />
          <AlertTitle>Information</AlertTitle>
          <AlertDescription>
            Public project will be accessible to all team members
          </AlertDescription>
        </Alert>
      </fieldset>
      <DialogFooter className='flex justify-end gap-2'>
        <DialogClose asChild>
          <Button size='sm' variant='ghost' disabled={isSubmitting}>
            Cancel
          </Button>
        </DialogClose>
        <Button size='sm' disabled={isSubmitting} className='min-w-16'>
          {isSubmitting ? (
            <Loader2 className='size-4 animate-spin' />
          ) : (
            'Create'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProjectForm;
