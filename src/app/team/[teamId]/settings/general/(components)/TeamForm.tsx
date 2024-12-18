'use client';

import { useParams } from 'next/navigation';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';

import Badge, { ColorsType } from '@/components/ui/badge';
import SettingsCard from '../../(components)/SettingsCard';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../convex/_generated/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TeamStatusEnum } from '@/lib/enums';
import { TEAM_STATUS_COLORS } from '@/lib/consts';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

// Independent form schemas
const TeamNameSchema = z.object({
  name: z
    .string()
    .min(1, 'Team name is required')
    .max(30, 'Team name must be 30 characters or less'),
});

const TeamStatusSchema = z.object({
  status: z.nativeEnum(TeamStatusEnum),
});

const TeamNameForm = ({
  teamId,
  initialName,
  onUpdateSuccess,
}: {
  teamId: Id<'teams'>;
  initialName: string;
  onUpdateSuccess?: () => void;
}) => {
  const updateTeam = useMutation(api.teams.updateTeam);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(TeamNameSchema),
    defaultValues: { name: initialName },
  });

  const onSubmit = async (data: { name: string }) => {
    try {
      await updateTeam({
        teamId,
        teamData: { name: data.name },
      });
      toast.success('Team name updated successfully');
      onUpdateSuccess?.();
    } catch {
      toast.error('Failed to update team name');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2'>
      <Input
        {...register('name')}
        className='w-1/2 h-9'
        placeholder='Your team name'
      />
      <Button type='submit' size='sm' className='min-w-16'>
        {isSubmitting ? <Loader2 className='size-4 animate-spin' /> : 'Save'}
      </Button>
    </form>
  );
};

const TeamImageForm = ({
  teamId,
  initialImageUrl,
  teamName,
  onUpdateSuccess,
}: {
  teamId: Id<'teams'>;
  initialImageUrl?: string;
  teamName?: string;
  onUpdateSuccess?: () => void;
}) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const imageElementRef = useRef<HTMLInputElement>(null);

  const updateTeam = useMutation(api.teams.updateTeam);
  const getUploadUrl = useMutation(api.upload.generateUploadUrl);

  const handleImageUpload = async (image: File) => {
    if (!image) return;
    setIsUploading(true);

    try {
      const uploadUrl = await getUploadUrl();
      if (!uploadUrl) throw new Error('Upload URL not found');

      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: { 'Content-Type': image.type },
        body: image,
      });

      if (!response.ok) throw new Error('Failed to upload image');

      const { storageId } = await response.json();

      await updateTeam({
        teamId,
        teamData: { imageId: storageId },
      });

      toast.success('Team image updated successfully');
      onUpdateSuccess?.();
    } catch {
      toast.error('Failed to upload team image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='flex gap-4'>
      <input
        type='file'
        accept='image/*'
        ref={imageElementRef}
        disabled={isUploading}
        onChange={e => {
          const selectedFile = e.target.files?.[0];
          if (selectedFile) {
            handleImageUpload(selectedFile);
          }
        }}
        className='hidden'
      />

      <div className='relative'>
        <Avatar
          className={cn(
            'size-12 cursor-pointer border border-border',
            isUploading && 'opacity-75'
          )}
          onClick={() => imageElementRef.current?.click()}
        >
          <AvatarImage src={initialImageUrl} alt='Team photo' />
          <AvatarFallback className='size-12'>
            {teamName ? teamName[0].toUpperCase() : 'T'}
          </AvatarFallback>
        </Avatar>
        {isUploading && (
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader2 className='animate-spin' />
          </div>
        )}
      </div>
      <h3 className='flex flex-col items-start text-sm'>
        <span className='font-medium'>Select your image</span>
        <button
          type='button'
          className='text-muted-foreground hover:underline hover:cursor-pointer'
          onClick={() => imageElementRef.current?.click()}
        >
          Click here
        </button>
      </h3>
    </div>
  );
};

const TeamStatusForm = ({
  teamId,
  initialStatus,
  onUpdateSuccess,
}: {
  teamId: Id<'teams'>;
  initialStatus: TeamStatusEnum;
  onUpdateSuccess?: () => void;
}) => {
  const updateTeam = useMutation(api.teams.updateTeam);

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(TeamStatusSchema),
    defaultValues: { status: initialStatus },
  });

  const onSubmit = async (data: { status: TeamStatusEnum }) => {
    try {
      await updateTeam({
        teamId,
        teamData: { status: data.status },
      });
      toast.success('Team status updated successfully');
      onUpdateSuccess?.();
    } catch {
      toast.error('Failed to update team status');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex items-center gap-2'>
      <Select
        onValueChange={val => setValue('status', val as TeamStatusEnum)}
        defaultValue={initialStatus}
      >
        <SelectTrigger className='w-1/2 h-9'>
          <SelectValue placeholder='Select team status' />
        </SelectTrigger>
        <SelectContent>
          {Object.values(TeamStatusEnum).map(status => (
            <SelectItem key={status} value={status}>
              <Badge
                decorated
                text={status}
                color={TEAM_STATUS_COLORS[status] as ColorsType}
              />
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button type='submit' size='sm'>
        {isSubmitting ? <Loader2 className='size-4 animate-spin' /> : 'Save'}
      </Button>
    </form>
  );
};

const TeamForm = () => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const teamData = useQuery(api.teams.getTeam, { teamId });

  if (!teamData)
    return (
      <ul className='space-y-2.5'>
        <li>
          <Skeleton className='h-48 w-full max-w-[600px]' />
        </li>
        <li>
          <Skeleton className='h-48 w-full max-w-[600px]' />
        </li>
        <li>
          <Skeleton className='h-48 w-full max-w-[600px]' />
        </li>
      </ul>
    );

  return (
    <div className='space-y-2.5'>
      <SettingsCard
        title='Team name'
        description='Please enter the team name, or a display name your team will recognize.'
        footerMsg='Please use 30 characters at maximum.'
      >
        <TeamNameForm teamId={teamId} initialName={teamData.name} />
      </SettingsCard>

      <SettingsCard
        title='Team image'
        description='This is your team image. Click the avatar to update it.'
        footerMsg='An image is optional but recommended.'
      >
        <TeamImageForm
          teamId={teamId}
          initialImageUrl={teamData.imageUrl!}
          teamName={teamData.name}
        />
      </SettingsCard>

      <SettingsCard
        title='Team status'
        description='To update your team status'
        footerMsg='This is an internal team status.'
      >
        <TeamStatusForm
          teamId={teamId}
          initialStatus={teamData.status as TeamStatusEnum}
        />
      </SettingsCard>
    </div>
  );
};

export default TeamForm;
