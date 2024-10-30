'use client';

import dynamic from 'next/dynamic';
import { useMutation } from 'convex/react';
import { Clock, Loader2, Plus, Shapes } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PopulatedTemplates } from './templatesColumns';

const SelectMembers = dynamic(
  () => import('../../(components)/SelectMembers'),
  {
    loading: () => <Skeleton className='h-10 w-[120px]' />,
  }
);

const SelectLabel = dynamic(() => import('../../(components)/SelectLabels'), {
  loading: () => <Skeleton className='h-10 w-[120px]' />,
});

type TemplatesFormProps = {
  templateData?: PopulatedTemplates;
  trigger?: React.ReactNode;
  onClose?: () => void;
};

const TemplatesForm = ({
  templateData,
  trigger,
  onClose,
}: TemplatesFormProps) => {
  const isEditMode = Boolean(templateData);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();

  const defaultValues = {
    title: templateData?.title || '',
    description: templateData?.description || '',
    status: templateData?.status || 'backlog',
    priority: templateData?.priority || 'low',
    assignee: templateData?.assignee?._id || undefined,
    label: templateData?.label?._id || undefined,
  };

  const {
    register,
    setValue,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(TemplatesSchema), defaultValues });

  const createTemplate = useMutation(api.templates.createTemplate);
  const editTemplate = useMutation(api.templates.updateTemplate);

  const submitHanlder = handleSubmit(async data => {
    const templatePayload = {
      title: data.title,
      description: data.description,
      status: data.status || 'backlog',
      priority: data.priority || 'low',
      assignee: data.assignee,
      label: data.label as Id<'labels'>,
    };

    try {
      await (isEditMode
        ? editTemplate({
            teamId,
            templateId: templateData!._id,
            templateData: templatePayload,
          })
        : createTemplate({ ...templatePayload, teamId, projectId }));

      setIsOpen(false);
      onClose?.();
      toast.success(
        `Template ${isEditMode ? 'updated' : 'created'} successfully`
      );
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} template`);
    }
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset(defaultValues);
    }
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm'>
            <Plus className='size-4 mr-1.5' strokeWidth={2} />
            New template
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHanlder} className='space-y-5'>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit' : 'Create'} template</DialogTitle>
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
              <Input
                placeholder='Task description'
                {...register('description')}
              />
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
              <SelectMembers
                defaultValue={defaultValues.assignee}
                setField={setValue}
              />
            </li>
            <li>
              <SelectLabel
                defaultValue={defaultValues.label}
                setField={setValue}
              />
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
      </DialogContent>
    </Dialog>
  );
};

export default TemplatesForm;
