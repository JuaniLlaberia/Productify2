'use client';

import { useMutation } from 'convex/react';
import { Clock, Loader2, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import InputWrapper from '@/components/ui/input-wrapper';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { api } from '../../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../../convex/_generated/dataModel';
import { ReportSchema } from '@/lib/validators';
import { PriorityEnum, ReportTypeEnum } from '@/lib/enums';

const ReportsForm = () => {
  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ReportSchema),
  });

  const createReport = useMutation(api.reports.createReport);

  const submitHandler = handleSubmit(async data => {
    const promise = createReport({
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
      teamId,
      projectId,
    });

    toast.promise(promise, {
      loading: 'Creating new report',
      success: 'Report created successfully',
      error: 'Failed to create report',
    });
  });

  return (
    <form onSubmit={submitHandler} className='space-y-5'>
      <DialogHeader>
        <DialogTitle>Create report</DialogTitle>
      </DialogHeader>
      <fieldset className='space-y-2'>
        <InputWrapper
          inputId='title'
          label='Title'
          error={errors.title?.message as string}
        >
          <Input id='title' placeholder='Report title' {...register('title')} />
        </InputWrapper>
        <InputWrapper
          inputId='description'
          label='Description'
          error={errors.description?.message as string}
        >
          <Textarea
            rows={5}
            id='description'
            placeholder='Describe the bug or get AI help'
            className='resize-none'
            {...register('description')}
          />
        </InputWrapper>
        <ul className='flex gap-2 flex-wrap pt-3'>
          <li>
            <Select onValueChange={val => setValue('type', val)}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SelectTrigger
                    icon={<Tag className='size-4' strokeWidth={1.5} />}
                    removeArrow
                    className='w-auto min-w-[120px]'
                  >
                    <SelectValue placeholder='Type' />
                  </SelectTrigger>
                </TooltipTrigger>
                <TooltipContent>Select type</TooltipContent>
              </Tooltip>
              <SelectContent>
                {Object.values(ReportTypeEnum).map(type => (
                  <SelectItem className='capitalize' key={type} value={type}>
                    {type}
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
        </ul>
      </fieldset>
      <DialogFooter>
        <DialogClose>
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

export default ReportsForm;
