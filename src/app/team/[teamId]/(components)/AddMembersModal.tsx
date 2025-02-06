'use client';

import { Check, Loader2, Plus, Search } from 'lucide-react';
import { ReactElement, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { ConvexError } from 'convex/values';

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
import { Id } from '../../../../../convex/_generated/dataModel';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { api } from '../../../../../convex/_generated/api';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { INITIAL_NUM_ITEMS } from '@/lib/consts';
import { MemberDataType } from '../settings/members/(components)/membersColumns';

type AddMembersModalProps = {
  trigger?: ReactElement;
  onSubmit: (userIds: Id<'users'>[]) => Promise<void>;
  existingMembers: Id<'users'>[];
  title?: string;
  description?: string;
  submitText?: string;
  onClose?: () => void;
};

const AddMembersModal = ({
  trigger,
  onSubmit,
  onClose,
  existingMembers,
  title = 'Add members',
  description = 'Select members to add to this project.',
  submitText = 'Add members',
}: AddMembersModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const { results, isLoading, status, loadMore } = useStablePaginatedQuery(
    api.teams.getTeamMembers,
    {
      teamId,
    },
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  const canLoadMore = status === 'CanLoadMore';
  const isLoadingMore = status === 'LoadingMore';

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      selectedMembers: existingMembers,
    },
  });
  const selectedMembers = watch('selectedMembers');

  const filteredMembers =
    results.filter((member): member is MemberDataType => {
      if (!member || !member.fullName) return false;

      return member.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    }) || [];

  const handleFormSubmit = handleSubmit(async data => {
    try {
      await onSubmit(data.selectedMembers);
      setIsOpen(false);
      onClose?.();
      toast.success(
        `Member${selectedMembers.length > 1 ? 's' : ''} added successfully`
      );
    } catch (error) {
      if (error instanceof ConvexError) {
        const errorMessage = error.message;

        if (errorMessage.includes('already')) {
          toast.error('All selected members are already part of this channel');
        } else {
          toast.error(
            `Failed to add member${selectedMembers.length > 1 ? 's' : ''}`
          );
        }
      }
    }
  });

  const toggleMember = (userId: Id<'users'>) => {
    const currentSelected = selectedMembers || [];
    const isSelected = currentSelected.includes(userId);

    if (isSelected) {
      setValue(
        'selectedMembers',
        currentSelected.filter(id => id !== userId)
      );
    } else {
      setValue('selectedMembers', [...currentSelected, userId]);
    }
  };

  const handleOpenDialog = () => {
    reset();
    setIsOpen(true);
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger
        asChild
        onClick={handleOpenDialog}
      >
        {trigger || (
          <Button size='sm'>
            <Plus className='mr-1.5 size-4' /> Add members
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form
          onSubmit={handleFormSubmit}
          className='space-y-4'
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className='relative w-full'>
            <Input
              type='search'
              placeholder='Search members...'
              className='pl-10 pr-4 py-2 w-full'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
          </div>

          {!isLoading ? (
            <Controller
              name='selectedMembers'
              control={control}
              render={({ field }) => (
                <div className='space-y-4'>
                  <div className=''>
                    {filteredMembers.length > 0 ? (
                      <ul className='space-y-2 overflow-y-auto max-h-72 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-muted scrollbar-track-transparent'>
                        {filteredMembers.map(member => {
                          const isSelected = field.value?.includes(member?._id);
                          const isExisting = existingMembers.includes(
                            member?._id
                          );

                          return (
                            <li
                              key={member._id}
                              onClick={() =>
                                !isExisting && toggleMember(member?._id)
                              }
                              className={`
                                flex items-center p-3 gap-3 rounded-lg
                                ${isExisting ? 'bg-muted/30 cursor-not-allowed' : 'hover:bg-accent cursor-pointer'}
                                ${isSelected && !isExisting ? 'bg-muted/30' : ''}
                              `}
                            >
                              <Avatar>
                                <AvatarImage
                                  src={member.image}
                                  alt={member.fullName}
                                />
                                <AvatarFallback>
                                  {member?.fullName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>

                              <div className='flex-1 min-w-0'>
                                <p className='font-medium truncate'>
                                  {member.fullName}
                                </p>
                              </div>

                              {(isSelected || isExisting) && (
                                <Check
                                  className={`h-4 w-4 ${
                                    isExisting
                                      ? 'text-muted-foreground'
                                      : 'text-primary'
                                  }`}
                                />
                              )}
                            </li>
                          );
                        })}
                        {canLoadMore ? (
                          <div className='flex items-center justify-center'>
                            {isLoadingMore ? (
                              <Loader2 className='size-4 animate-spin' />
                            ) : (
                              <Button
                                size='sm'
                                variant='ghost'
                                onClick={e => {
                                  e.preventDefault();
                                  loadMore(INITIAL_NUM_ITEMS);
                                }}
                              >
                                <Plus className='size-4 mr-1.5' /> Load more
                              </Button>
                            )}
                          </div>
                        ) : null}
                      </ul>
                    ) : (
                      <p className='text-center text-sm text-muted-foreground p-4'>
                        No members found
                      </p>
                    )}
                  </div>
                </div>
              )}
            />
          ) : (
            <div className='space-y-1.5'>
              <Skeleton className='w-full h-10' />
              <Skeleton className='w-full h-10' />
              <Skeleton className='w-full h-10' />
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='ghost'
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className='min-w-24'
              type='submit'
              size='sm'
              disabled={isSubmitting || selectedMembers.length === 0}
            >
              {isSubmitting ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                submitText
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMembersModal;
