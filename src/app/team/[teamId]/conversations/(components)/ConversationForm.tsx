'use client';

import { useMutation, useQuery } from 'convex/react';
import { useForm, Controller } from 'react-hook-form';
import { api } from '../../../../../../convex/_generated/api';
import { useParams, useRouter } from 'next/navigation';
import { Plus, Search, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { type ReactNode, useState } from 'react';
import { ConvexError } from 'convex/values';

import { Id } from '../../../../../../convex/_generated/dataModel';
import { Input } from '@/components/ui/input';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ConversationSchema } from '@/lib/validators';

type ConversationFormProps = {
  trigger?: ReactNode;
  onClose?: () => void;
};

const ConversationForm = ({ trigger, onClose }: ConversationFormProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const router = useRouter();

  const { teamId } = useParams<{
    teamId: Id<'teams'>;
  }>();

  const members = useQuery(api.teams.getTeamMembers, { teamId });
  const createConversation = useMutation(api.conversations.createConversation);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(ConversationSchema),
    defaultValues: {
      memberId: '',
    },
  });

  const filteredMembers =
    members?.filter(member =>
      member?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const onSubmit = handleSubmit(async data => {
    try {
      const conversationId = await createConversation({
        teamId,
        otherUserId: data.memberId as Id<'users'>,
      });

      setIsOpen(false);
      onClose?.();

      router.push(`/team/${teamId}/conversations/${conversationId}`);
      toast.success(`Conversation created successfully`);
      reset();
    } catch (error) {
      // Check for specific Convex error
      if (error instanceof ConvexError) {
        const errorMessage = error.message;

        if (errorMessage.includes('already exists')) {
          toast.error('A conversation with this member already exists');
        } else {
          toast.error('Failed to create conversation');
        }
      } else {
        toast.error(`Failed to create conversation`);
      }
    }
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        setIsOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger asChild>
        {trigger || (
          <Button size='sm'>
            <Plus className='size-4 mr-1.5' strokeWidth={2} />
            New conversation
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onSubmit} className='space-y-5'>
          <DialogHeader>
            <DialogTitle>Select member</DialogTitle>
            <DialogDescription>
              Conversations allow you to chat directly with another team member
              privately.
            </DialogDescription>
          </DialogHeader>
          <fieldset className='space-y-4'>
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

            <Controller
              name='memberId'
              control={control}
              render={({ field }) => (
                <>
                  {!members ? (
                    <ul className='space-y-1.5'>
                      {[1, 2, 3].map(key => (
                        <li key={key}>
                          <Skeleton className='h-16 w-full' />
                        </li>
                      ))}
                    </ul>
                  ) : filteredMembers.length > 0 ? (
                    <ul className='space-y-2'>
                      {filteredMembers.map(member => (
                        <li
                          key={member?._id}
                          className={`
                            flex items-center p-2 rounded-lg cursor-pointer
                            ${
                              field.value === member?._id
                                ? 'bg-primary/10 border border-primary/30'
                                : 'hover:bg-accent/50 border border-transparent'
                            }
                            transition-colors duration-200
                          `}
                          onClick={() => field.onChange(member?._id)}
                        >
                          <div className='flex items-center space-x-3 flex-grow'>
                            <Avatar>
                              <AvatarImage
                                src={member?.profileImage}
                                alt={member?.fullName}
                              />
                              <AvatarFallback>
                                {member?.fullName.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className='font-medium'>{member?.fullName}</p>
                              <p className='text-sm text-muted-foreground'>
                                {member?.email}
                              </p>
                            </div>
                          </div>
                          <div className='ml-auto pl-2'>
                            {field.value === member?._id && (
                              <div className='w-5 h-5 rounded-full text-white flex items-center justify-center'>
                                <Check className='w-4 h-4' />
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className='text-center text-muted-foreground text-sm py-6'>
                      No members found
                    </p>
                  )}
                  {errors.memberId && (
                    <p className='text-destructive text-sm mt-2'>
                      {errors.memberId.message}
                    </p>
                  )}
                </>
              )}
            />
          </fieldset>
          <DialogFooter className='flex justify-end gap-2'>
            <DialogClose asChild>
              <Button type='button' size='sm' variant='ghost'>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type='submit'
              size='sm'
              disabled={isSubmitting}
              className='min-w-16'
            >
              {isSubmitting ? (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
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

export default ConversationForm;
