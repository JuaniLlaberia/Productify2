'use client';

import { useMutation } from 'convex/react';
import { Clock, Loader2, Plus, Tag } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import InputWrapper from '@/components/ui/input-wrapper';
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
import { Doc, Id } from '../../../../../../../../convex/_generated/dataModel';
import { ReportSchema } from '@/lib/validators';
import { PriorityEnum, ReportTypeEnum } from '@/lib/enums';

type ReportsFormProps = {
  reportData?: Doc<'reports'>;
  trigger?: React.ReactNode;
  onClose?: () => void;
};

const ReportsForm = ({ reportData, trigger, onClose }: ReportsFormProps) => {
  const isEditMode = Boolean(reportData);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();

  const defaultValues = {
    title: reportData?.title || '',
    description: reportData?.description || '',
    priority: reportData?.priority || 'low',
    type: reportData?.type || 'other',
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ReportSchema),
    defaultValues,
  });

  const createReport = useMutation(api.reports.createReport);
  const editReport = useMutation(api.reports.updateReport);

  const submitHandler = handleSubmit(async data => {
    const reportPayload = {
      title: data.title,
      description: data.description,
      type: data.type,
      priority: data.priority,
    };

    try {
      await (isEditMode
        ? editReport({
            teamId,
            reportId: reportData!._id,
            reportData: reportPayload,
          })
        : createReport({ ...reportPayload, teamId, projectId }));

      setIsOpen(false);
      onClose?.();
      toast.success(
        `Report ${isEditMode ? 'updated' : 'created'} successfully`
      );
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} report`);
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
            New report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHandler} className='space-y-5'>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit' : 'Create'} report</DialogTitle>
          </DialogHeader>
          <fieldset className='space-y-2'>
            <InputWrapper
              inputId='title'
              label='Title'
              error={errors.title?.message as string}
            >
              <Input
                id='title'
                placeholder='Report title'
                {...register('title')}
              />
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
                <Select
                  defaultValue={defaultValues.type}
                  onValueChange={(val: ReportTypeEnum) => setValue('type', val)}
                >
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
                      <SelectItem
                        className='capitalize'
                        key={type}
                        value={type}
                      >
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </li>
              <li>
                <Select
                  defaultValue={defaultValues.priority}
                  onValueChange={(val: PriorityEnum) =>
                    setValue('priority', val)
                  }
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
            </ul>
          </fieldset>
          <DialogFooter>
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
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportsForm;
