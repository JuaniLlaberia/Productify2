'use client';

import { useMutation } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useState } from 'react';

import InputWrapper from '@/components/ui/input-wrapper';
import { api } from '../../../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { StorageSchema } from '@/lib/validators';
import { Doc, Id } from '../../../../../../convex/_generated/dataModel';
import { EmojiPopover } from '@/components/ui/emoji-popover';
import { Input } from '@/components/ui/input';

type StorageFormProps = {
  storageData?: Doc<'storages'>;
  trigger?: React.ReactNode;
  onClose?: () => void;
};

const StorageForm = ({ storageData, trigger, onClose }: StorageFormProps) => {
  const isEditMode = Boolean(storageData);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const defaultValues = {
    name: storageData?.name || '',
    private: storageData?.private || false,
    icon: storageData?.icon || '',
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
    resolver: zodResolver(StorageSchema),
  });
  const router = useRouter();

  const createStorage = useMutation(api.storages.createStorage);
  const editStorage = useMutation(api.storages.updateStorage);

  const submitHandler = handleSubmit(async data => {
    try {
      const storagePayload = {
        teamId,
        storageData: {
          name: data.name,
          private: data.private,
          icon: data.icon,
        },
      };

      const storageId = await (isEditMode
        ? editStorage({ storageId: storageData!._id, ...storagePayload })
        : createStorage(storagePayload));

      setIsOpen(false);
      onClose?.();

      if (!isEditMode) router.push(`/team/${teamId}/storages/${storageId}`);

      toast.success(
        `Storage ${isEditMode ? 'updated' : 'created'} successfully`
      );
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} storage`);
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
            New storage
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHandler} className='space-y-5'>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit' : 'Create'} storage</DialogTitle>
            {!isEditMode && (
              <DialogDescription>
                A storage is a cloud drive, where your team or group can store
                documents, images and files related to the project.
              </DialogDescription>
            )}
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
                  placeholder='e.g. Documentation, Research files, Images'
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
                Public storages will be accessible to all team members
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

export default StorageForm;
