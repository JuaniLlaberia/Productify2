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
import { DatePicker } from '@/components/ui/date-picker';
import { TaskSchema } from '@/lib/validators';
import { Skeleton } from '@/components/ui/skeleton';
import { PopulatedTask } from './tasksColumns';

const SelectMembers = dynamic(
  () => import('../../(components)/SelectMembers'),
  {
    loading: () => <Skeleton className='h-10 w-[120px]' />,
  }
);

const SelectLabel = dynamic(() => import('../../(components)/SelectLabels'), {
  loading: () => <Skeleton className='h-10 w-[120px]' />,
});

const TaskForm = ({ taskData }: { taskData?: PopulatedTask }) => {
  const isEditMode = Boolean(taskData);
  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();

  const defaultValues = {
    title: taskData?.title || '',
    description: taskData?.description || '',
    status: taskData?.status || 'backlog',
    priority: taskData?.priority || 'low',
    assignee: taskData?.assignee?._id || undefined,
    date: taskData?.dueDate ? new Date(taskData.dueDate) : undefined,
    label: taskData?.label?._id || undefined,
  };

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues,
  });

  const createTask = useMutation(api.tasks.createTask);
  const editTask = useMutation(api.tasks.updateTask);

  const submitHandler = handleSubmit(async data => {
    const taskPayload = {
      title: data.title,
      description: data.description,
      status: data.status || 'backlog',
      priority: data.priority || 'low',
      assignee: data.assignee,
      dueDate: data.date?.getTime(),
      label: data.label as Id<'labels'>,
    };

    const promise = isEditMode
      ? editTask({ teamId, taskId: taskData!._id, taskData: taskPayload })
      : createTask({ ...taskPayload, isSubTask: false, teamId, projectId });

    toast.promise(promise, {
      loading: `${isEditMode ? 'Updating' : 'Creating'} task`,
      success: `Task ${isEditMode ? 'updated' : 'created'} successfully`,
      error: `Failed to ${isEditMode ? 'update' : 'create'} task`,
    });
  });

  return (
    <form onSubmit={submitHandler} className='space-y-5'>
      <DialogHeader>
        <DialogTitle>{isEditMode ? 'Edit' : 'Create'} task</DialogTitle>
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
          <Select
            defaultValue={defaultValues.status}
            onValueChange={(val: StatusEnum) => setValue('status', val)}
          >
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
          <Select
            defaultValue={defaultValues.priority}
            onValueChange={(val: PriorityEnum) => setValue('priority', val)}
          >
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
              <TooltipContent>Select priority</TooltipContent>
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
          <SelectMembers
            defaultValue={defaultValues.assignee}
            setField={setValue}
          />
        </li>
        <li>
          <SelectLabel defaultValue={defaultValues.label} setField={setValue} />
        </li>
        <li>
          <DatePicker defaultValue={defaultValues.date} setValue={setValue} />
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
            ) : isEditMode ? (
              'Update'
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
