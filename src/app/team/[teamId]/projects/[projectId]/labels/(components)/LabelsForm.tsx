'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
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

import { LabelSchema } from '@/lib/validators';
import { api } from '../../../../../../../../convex/_generated/api';
import { Doc, Id } from '../../../../../../../../convex/_generated/dataModel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { COLORS } from '@/lib/consts';

type TaskLabelsProps = {
  labelData?: Doc<'labels'>;
  trigger?: React.ReactNode;
  onClose?: () => void;
};

const LabelsForm = ({ labelData, trigger, onClose }: TaskLabelsProps) => {
  const isEditMode = Boolean(labelData);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  const defaultValues = {
    title: labelData?.title || '',
    color: labelData
      ? COLORS.find(color => color.label === labelData.color)
      : COLORS[0],
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    resolver: zodResolver(LabelSchema),
    defaultValues,
  });

  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();

  const createLabel = useMutation(api.labels.createLabel);
  const editLabel = useMutation(api.labels.updateLabel);

  const submitHandler = handleSubmit(async data => {
    const labelPayload = {
      title: data.title,
      color: data.color!.label,
    };

    try {
      await (isEditMode
        ? editLabel({
            teamId,
            labelId: labelData!._id,
            labelData: labelPayload,
          })
        : createLabel({ ...labelPayload, teamId, projectId }));

      setIsOpen(false);
      onClose?.();
      toast.success(`Label ${isEditMode ? 'updated' : 'created'} successfully`);
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} label`);
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
            New label
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHandler} className='space-y-5'>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit' : 'Create'} label</DialogTitle>
          </DialogHeader>
          <fieldset className='space-y-2'>
            <div className='flex items-end gap-1.5'>
              <InputWrapper
                label='Title & Color'
                error={errors.title?.message as string}
                inputId='title'
                className='w-full'
              >
                <Input
                  id='title'
                  placeholder='e.g. Feature, Fix, Front-End'
                  {...register('title')}
                />
              </InputWrapper>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <button className='flex items-center justify-center text-muted-foreground shrink-0 size-10 rounded-lg border border-input bg-transparent cursor-pointer hover:text-primary transition-all'>
                    {watch('color') ? (
                      <div
                        className='size-7 rounded-lg'
                        style={{
                          backgroundColor: watch('color')?.value,
                        }}
                      />
                    ) : (
                      <Plus className='size-4' strokeWidth={2} />
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent side='bottom' align='end'>
                  <h2 className='text-sm font-medium'>Select a color</h2>
                  <ul className='grid grid-cols-7 gap-2.5 mt-3'>
                    {COLORS.map(color => (
                      <Tooltip key={color.value}>
                        <TooltipTrigger className='flex items-center justify-center'>
                          <li
                            onClick={() => {
                              setValue('color', color);
                              setIsPopoverOpen(false);
                            }}
                            style={{ backgroundColor: color.value }}
                            className={cn(
                              'size-7 rounded-lg hover:ring hover:ring-blue-700',
                              watch('color')?.label === color.label
                                ? 'ring ring-blue-700'
                                : null
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent className='capitalize'>
                          {color.label}
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </ul>
                </PopoverContent>
              </Popover>
            </div>
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

export default LabelsForm;
