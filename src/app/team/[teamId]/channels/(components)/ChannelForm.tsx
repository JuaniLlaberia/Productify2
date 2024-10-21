'use client';

import { useMutation } from 'convex/react';
import { useForm, Controller } from 'react-hook-form';
import { api } from '../../../../../../convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';

import InputWrapper from '@/components/ui/input-wrapper';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { ChannelSchema } from '@/lib/validators';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ChannelForm = () => {
  const router = useRouter();
  const { teamId } = useParams();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      public: false,
    },
    resolver: zodResolver(ChannelSchema),
  });
  const createChannel = useMutation(api.channels.createChannel);

  const submitHandler = handleSubmit(async data => {
    const promise = createChannel({
      teamId: teamId as Id<'teams'>,
      channelData: {
        name: data.name,
        public: data.public,
      },
    }).then(channelId => {
      router.push(`/team/${teamId}/channels/${channelId}`);
    });

    toast.promise(promise, {
      loading: 'Creating new document',
      success: 'Document created successfully',
      error: 'Failed to create document',
    });
  });

  return (
    <form onSubmit={submitHandler} className='space-y-5'>
      <DialogHeader>
        <DialogTitle>Create channel</DialogTitle>
        <DialogDescription>
          Channel allows you to communicate between and within teams.
        </DialogDescription>
      </DialogHeader>
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
        <button className='flex items-center justify-center text-muted-foreground size-10 rounded-lg border border-input bg-transparent cursor-pointer hover:text-primary transition-all'>
          <span className='sr-only'>Select icon</span>
          <Plus className='size-4' />
        </button>
      </div>
      <div className='flex items-center justify-between py-1'>
        <div className='flex flex-col'>
          <Label htmlFor='public'>Make private</Label>
          <p className='text-sm text-muted-foreground'>
            Only members will see it
          </p>
        </div>
        <Controller
          control={control}
          name='public'
          render={({ field: { onChange, value } }) => (
            <Switch id='public' onCheckedChange={onChange} checked={value} />
          )}
        />
      </div>
      <DialogFooter className='flex justify-end gap-2'>
        <DialogClose asChild>
          <Button size='sm' variant='ghost' disabled={isSubmitting}>
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

export default ChannelForm;
