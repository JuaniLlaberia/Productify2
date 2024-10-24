'use client';

import { useMutation } from 'convex/react';
import { Clock, Loader2, Shapes } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import SelectMembers from '../../(components)/SelectMembers';
import SelectLabel from '../../(components)/SelectLabels';
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
import { DatePicker } from '@/components/ui/date-picker';
import { TaskSchema } from '@/lib/validators';

const TaskForm = () => {
  const { teamId, projectId } = useParams();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(TaskSchema) });

  const createTask = useMutation(api.tasks.createTask);
  const submitHanlder = handleSubmit(async data => {
    const promise = createTask({
      title: data.title,
      description: data.description,
      status: data.staus || 'backlog',
      priority: data.priority || 'low',
      assignee: data.assignee,
      dueDate: data.date?.getTime(),
      label: data.label as Id<'labels'>,
      teamId: teamId as Id<'teams'>,
      projectId: projectId as Id<'projects'>,
      isSubTask: false,
    });

    toast.promise(promise, {
      loading: 'Creating new task',
      success: 'Task created successfully',
      error: 'Failed to create task',
    });
  });

  return (
    <form onSubmit={submitHanlder} className='space-y-5'>
      <DialogHeader>
        <DialogTitle>Create task</DialogTitle>
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
        <li>
          <DatePicker setValue={setValue} />
        </li>
      </ul>
      <DialogFooter className='flex items-center sm:justify-between'>
        <Button size='sm' variant='outline'>
          Use templates
        </Button>
        <div className='space-x-1.5'>
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
        </div>
      </DialogFooter>
    </form>
  );
};

export default TaskForm;
