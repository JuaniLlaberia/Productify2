'use client';

import { Clock, Loader2, Shapes, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';

import SelectMembers from '../../(components)/SelectMembers';
import SelectLabel from '../../(components)/SelectLabels';
import DeleteTasksModal from './DeleteTasksModal';
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PopulatedTask } from './tasksColumns';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { TaskSchema } from '@/lib/validators';
import { Id } from '../../../../../../../../convex/_generated/dataModel';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { api } from '../../../../../../../../convex/_generated/api';
import SubTasksList from './SubTasksList';

type TaskSheetProps = {
  taskData: PopulatedTask;
  trigger?: React.ReactNode;
  onClose?: () => void;
};

const TaskSheet = ({ taskData, trigger, onClose }: TaskSheetProps) => {
  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const defaultValues = {
    title: taskData?.title || '',
    description: taskData?.description || '',
    status: taskData?.status,
    priority: taskData?.priority,
    assignee: taskData?.assignee?._id || undefined,
    date: taskData?.dueDate ? new Date(taskData.dueDate) : undefined,
    label: taskData?.label?._id || undefined,
  };

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(TaskSchema),
    defaultValues,
  });

  const formValues = watch();

  const editTask = useMutation(api.tasks.updateTask);
  const submitHandler = handleSubmit(async data => {
    const taskPayload = {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assignee: data.assignee,
      dueDate: data.date?.getTime(),
      label: data.label as Id<'labels'>,
    };

    try {
      await editTask({ teamId, taskId: taskData._id, taskData: taskPayload });

      setIsOpen(false);
      onClose?.();
      toast.success(`Task updated created successfully`);
    } catch {
      toast.error(`Failed to update create task`);
    }
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className='flex flex-col h-full'>
        <div className='flex-1 space-y-4'>
          <fieldset className='space-y-2'>
            <div>
              <Label htmlFor='title' className='sr-only'>
                Sheet Title
              </Label>
              <Input
                id='title'
                type='text'
                placeholder='Task title'
                className='text-xl font-medium w-full bg-transparent border-none outline-none placeholder:text-muted-foreground/85 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 py-2 px-0'
                {...register('title')}
              />
            </div>
            <div>
              <Label htmlFor='description' className='sr-only'>
                Sheet Title
              </Label>
              <Input
                id='description'
                type='text'
                placeholder='Add description...'
                className='text-base w-full bg-transparent border-none outline-none placeholder:text-muted-foreground/85 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 py-2 px-0'
                {...register('description')}
              />
            </div>
          </fieldset>
          <ul>
            <li className='grid grid-cols-2 items-center'>
              <Label className='text-sm text-muted-foreground font-medium'>
                Status
              </Label>
              <Select
                value={formValues.status}
                onValueChange={(val: StatusEnum) => setValue('status', val)}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectTrigger
                      icon={<Shapes className='size-4' strokeWidth={1.5} />}
                      removeArrow
                      className='w-auto min-w-[120px] border-transparent hover:border-input'
                    >
                      {formValues.status || (
                        <span className='text-muted-foreground'>Status</span>
                      )}
                    </SelectTrigger>
                  </TooltipTrigger>
                  <TooltipContent side='left'>Select status</TooltipContent>
                </Tooltip>
                <SelectContent>
                  {Object.values(StatusEnum).map(status => (
                    <SelectItem
                      className='capitalize'
                      key={status}
                      value={status}
                    >
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </li>
            <li className='grid grid-cols-2 items-center'>
              <Label className='text-sm text-muted-foreground font-medium'>
                Priority
              </Label>
              <Select
                value={formValues.priority}
                onValueChange={(val: PriorityEnum) => setValue('priority', val)}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SelectTrigger
                      icon={<Clock className='size-4' strokeWidth={1.5} />}
                      removeArrow
                      className='w-auto min-w-[120px] border-transparent hover:border-input'
                    >
                      {formValues.priority || (
                        <span className='text-muted-foreground'>Priority</span>
                      )}
                    </SelectTrigger>
                  </TooltipTrigger>
                  <TooltipContent side='left'>Select priority</TooltipContent>
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
            <li className='grid grid-cols-2 items-center'>
              <Label className='text-sm text-muted-foreground font-medium'>
                Assignee
              </Label>
              <SelectMembers
                defaultValue={formValues.assignee}
                setField={setValue}
                borderHidden
              />
            </li>
            <li className='grid grid-cols-2 items-center'>
              <Label className='text-sm text-muted-foreground font-medium'>
                Label
              </Label>
              <SelectLabel
                defaultValue={formValues.label}
                setField={setValue}
                borderHidden
              />
            </li>
            <li className='grid grid-cols-2 items-center'>
              <Label className='text-sm text-muted-foreground font-medium'>
                Due date
              </Label>
              <DatePicker
                defaultValue={formValues.date}
                setValue={setValue}
                borderHidden
              />
            </li>
          </ul>
          <SubTasksList
            teamId={teamId}
            parentId={taskData._id}
            projectId={projectId}
          />
        </div>
        <SheetFooter className='mt-auto flex justify-between items-center w-full'>
          <DeleteTasksModal
            teamId={teamId}
            ids={[taskData?._id]}
            trigger={
              <Button size='icon' variant='ghost' className='group'>
                <Trash2
                  className='size-4 group-hover:text-red-400'
                  strokeWidth={1.5}
                />
              </Button>
            }
            onSuccess={() => setIsOpen(false)}
          />
          <Button size='sm' onClick={submitHandler} className='min-w-24'>
            {isSubmitting ? (
              <Loader2 className='size-4 animate-spin' />
            ) : (
              'Update task'
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default TaskSheet;
