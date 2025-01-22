'use client';

import { useMutation } from 'convex/react';
import { useForm, Controller } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';

import InputWrapper from '@/components/ui/input-wrapper';
import { CabinetSchema } from '@/lib/validators';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmojiPopover } from '@/components/ui/emoji-popover';
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';

type CabinetFormProps = {
  cabinetData?: Doc<'cabinets'>;
  trigger?: ReactNode;
  onClose?: () => void;
};

const CabinetForm = ({ cabinetData, trigger, onClose }: CabinetFormProps) => {
  const isEditMode = Boolean(cabinetData?._id);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();

  const defaultValues = {
    name: cabinetData?.name || '',
    private: cabinetData?.private || false,
    icon: cabinetData?.icon || '',
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues,
    resolver: zodResolver(CabinetSchema),
  });

  const createCabinet = useMutation(api.cabinets.createCabinet);
  const editCabinet = useMutation(api.cabinets.updateCabinet);

  const submitHandler = handleSubmit(async data => {
    const cabinetPayload = {
      name: data.name,
      icon: data.icon,
      private: isEditMode ? Boolean(cabinetData?.private) : data.private,
    };

    try {
      await (isEditMode
        ? editCabinet({
            teamId,
            cabinetId: cabinetData!._id,
            cabinetData: cabinetPayload,
          })
        : createCabinet({ teamId, cabinetData: cabinetPayload }));

      setIsOpen(false);
      onClose?.();

      toast.success(
        `Cabinet ${isEditMode ? 'updated' : 'created'} successfully`
      );
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} cabinet`);
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
            New cabinet
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHandler} className='space-y-5'>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit' : 'Create'} cabinet</DialogTitle>
            <DialogDescription>
              Cabinets allows you to write and store documents.
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
                disabled={isEditMode}
                control={control}
                name='private'
                render={({ field: { onChange, value } }) => (
                  <Switch
                    onCheckedChange={onChange}
                    checked={value}
                    disabled={isEditMode}
                  />
                )}
              />
            </div>
            <Alert variant='informative'>
              <AlertCircle className='size-4' />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                Public cabinets will be accessible to all team members
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
      </DialogContent>
    </Dialog>
  );
};

export default CabinetForm;
