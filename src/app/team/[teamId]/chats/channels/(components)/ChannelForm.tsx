'use client';

import { useMutation } from 'convex/react';
import { useForm, Controller } from 'react-hook-form';
import { api } from '../../../../../../../convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';

import InputWrapper from '@/components/ui/input-wrapper';
import { Doc, Id } from '../../../../../../../convex/_generated/dataModel';
import { ChannelSchema } from '@/lib/validators';
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

type ChannelFormProps = {
  channelData?: Doc<'channels'>;
  trigger?: ReactNode;
  onClose?: () => void;
};

const ChannelForm = ({ channelData, trigger, onClose }: ChannelFormProps) => {
  const isEditMode = Boolean(channelData?._id);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const router = useRouter();

  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    defaultValues: {
      name: channelData?.name || '',
      private: channelData?.private || false,
      icon: channelData?.icon || '',
    },
    resolver: zodResolver(ChannelSchema),
  });

  const createChannel = useMutation(api.channels.createChannel);
  const editChannel = useMutation(api.channels.updateChannel);

  const submitHandler = handleSubmit(async data => {
    const channelPayload = {
      name: data.name,
      icon: data.icon,
      private: data.private,
    };

    try {
      const channelId = await (isEditMode
        ? editChannel({
            teamId,
            channelId: channelData!._id,
            channelData: channelPayload,
          })
        : createChannel({ teamId, channelData: channelPayload }));

      setIsOpen(false);
      onClose?.();

      if (!isEditMode)
        router.push(`/team/${teamId}/chats/channels/${channelId}`);
      toast.success(
        `Channel ${isEditMode ? 'updated' : 'created'} successfully`
      );
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} channel`);
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm'>
            <Plus className='size-4 mr-1.5' strokeWidth={2} />
            New channel
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={submitHandler} className='space-y-5'>
          <DialogHeader>
            <DialogTitle>{isEditMode ? 'Edit' : 'Create'} channel</DialogTitle>
            <DialogDescription>
              Channel allows you to communicate between and within teams.
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
                Public project will be accessible to all team members
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

export default ChannelForm;
