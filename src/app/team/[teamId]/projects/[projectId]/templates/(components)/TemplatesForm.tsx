'use client';

import dynamic from 'next/dynamic';
import { useMutation } from 'convex/react';
import { Clock, Loader2, Shapes } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import InputWrapper from '@/components/ui/input-wrapper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '../../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../../convex/_generated/dataModel';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { TemplatesSchema } from '@/lib/validators';
import { Skeleton } from '@/components/ui/skeleton';

const SelectMembers = dynamic(
  () => import('../../(components)/SelectMembers'),
  {
    loading: () => <Skeleton className='h-10 w-[120px]' />,
  }
);

const SelectLabel = dynamic(() => import('../../(components)/SelectLabels'), {
  loading: () => <Skeleton className='h-10 w-[120px]' />,
});

const TemplatesForm = () => {
  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(TemplatesSchema) });

  const createTemplate = useMutation(api.templates.createTemplate);
  const submitHanlder = handleSubmit(async data => {
    const promise = createTemplate({
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
      label: data.label as Id<'labels'>,
      teamId,
      projectId,
    });

    toast.promise(promise, {
      loading: 'Creating new template',
      success: 'Template created successfully',
      error: 'Failed to create template',
    });
  });

  return (
    <form onSubmit={submitHanlder} className='space-y-5'>
      <DialogHeader>
        <DialogTitle>Create template</DialogTitle>
      </DialogHeader>
      <fieldset className='space-y-2'>
        <InputWrapper
          inputId='title'
          label='Title'
          error={errors.title?.message as string}
        >
          <Input placeholder='Task title' {...register('title')} />
        </InputWrapper>
        <InputWrapper inputId='description' label='Description'>
          <Input placeholder='Task description' {...register('description')} />
        </InputWrapper>
      </fieldset>
      <ul className='flex gap-2 flex-wrap'>
        <li>
          <Select onValueChange={val => setValue('status', val)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger
                  icon={<Shapes className='size-4' strokeWidth={1.5} />}
                  removeArrow
                  className='w-auto min-w-[120px]'
                >
                  <SelectValue placeholder='Status' />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>Select status</TooltipContent>
            </Tooltip>
            <SelectContent>
              {Object.values(StatusEnum).map(status => (
                <SelectItem className='capitalize' key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
        <li>
          <Select onValueChange={val => setValue('priority', val)}>
            <Tooltip>
              <TooltipTrigger asChild>
                <SelectTrigger
                  icon={<Clock className='size-4' strokeWidth={1.5} />}
                  removeArrow
                  className='w-auto min-w-[120px]'
                >
                  <SelectValue placeholder='Priority' />
                </SelectTrigger>
              </TooltipTrigger>
              <TooltipContent>Select type</TooltipContent>
            </Tooltip>
            <SelectContent>
              {Object.values(PriorityEnum).map(priority => (
                <SelectItem
                  className='capitalize'
                  key={priority}
                  value={priority}
                >
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </li>
        <li>
          <SelectMembers setField={setValue} />
        </li>
        <li>
          <SelectLabel setField={setValue} />
        </li>
      </ul>
      <DialogFooter>
        <DialogClose asChild>
          <Button size='sm' variant='outline'>
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

export default TemplatesForm;
