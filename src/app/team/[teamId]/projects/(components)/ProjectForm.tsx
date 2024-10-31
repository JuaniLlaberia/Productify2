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
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { EmojiPopover } from '@/components/ui/emoji-popover';

const ProjectForm = ({
  teamId,
  projectData,
  onSuccess,
}: {
  teamId: Id<'teams'>;
  projectData?: Doc<'projects'>;
  onSuccess?: () => void;
}) => {
  const isEditMode = Boolean(projectData);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: projectData?.name || '',
      private: projectData?.private || false,
      icon: projectData?.icon || '',
    },
    resolver: zodResolver(ProjectSchema),
  });
  const router = useRouter();

  const createProject = useMutation(api.projects.createProject);
  const editProject = useMutation(api.projects.updateProject);

  const submitHandler = handleSubmit(async data => {
    try {
      const projectPayload = {
        teamId,
        projectData: {
          name: data.name,
          private: data.private,
          icon: data.icon,
        },
      };

      const projectId = await (isEditMode
        ? editProject({ projectId: projectData!._id, ...projectPayload })
        : createProject(projectPayload));

      onSuccess?.();
      console.log(onSuccess);

      if (!isEditMode) router.push(`${projectId}/tasks`);

      toast.success(
        `Project ${isEditMode ? 'updated' : 'created'} successfully`
      );
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} project`);
    }
  });

  return (
    <form onSubmit={submitHandler} className='space-y-5'>
      <DialogHeader>
        <DialogTitle>{isEditMode ? 'Edit' : 'Create'} project</DialogTitle>
        {!isEditMode ? (
          <DialogDescription>
            A projects represents work-spaces, teams, or groups, each with its
            own tasks, templates, labels and features.
          </DialogDescription>
        ) : null}
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
          <EmojiPopover
            onEmojiSelect={emoji => {
              setValue('icon', emoji.native);
            }}
          >
            <button className='flex items-center justify-center text-muted-foreground size-10 shrink-0 rounded-lg border border-input bg-transparent cursor-pointer hover:text-primary transition-all'>
              <span className='sr-only'>Select icon</span>
              {!watch('icon') ? <Plus className='size-4' /> : watch('icon')}
            </button>
          </EmojiPopover>
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
            name='private'
            render={({ field: { onChange, value } }) => (
              <Switch onCheckedChange={onChange} checked={value} />
            )}
          />
        </div>
        <Alert variant='informative'>
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
          ) : isEditMode ? (
            'Update'
          ) : (
            'Create'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default ProjectForm;
