'use client';

import { useQuery } from 'convex/react';
import { useEffect, useState } from 'react';
import { Check, Users } from 'lucide-react';
import type { UseFormSetValue } from 'react-hook-form';

import Hint from '@/components/ui/hint';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

type SelectMembersProps = {
  teamId: Id<'teams'>;
  projectId: Id<'projects'>;
  setField: UseFormSetValue<any>;
  defaultValue?: string;
  borderHidden?: boolean;
};

const SelectMembers = ({
  teamId,
  projectId,
  setField,
  defaultValue,
  borderHidden,
}: SelectMembersProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<
    | {
        id?: string;
        name?: string;
        img?: string;
      }
    | undefined
  >(undefined);

  const project = useQuery(api.projects.getProjectById, { teamId, projectId });
  const isPrivate = project?.private;

  // Only query the needed members based on privacy status
  const members = useQuery(
    isPrivate
      ? api.projects.getProjectMembers
      : api.teams.getTeamMembersNoPagination,
    isPrivate ? { teamId, projectId } : { teamId }
  );

  useEffect(() => {
    if (defaultValue && members) {
      const defaultMember = members.find(
        member => member?._id === defaultValue
      );
      if (defaultMember) {
        setValue({
          id: defaultMember._id,
          name: defaultMember.fullName,
          img: defaultMember.image,
        });
      }
    }
  }, [defaultValue, members]);

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Hint
        side={borderHidden ? 'left' : 'top'}
        label='Set assignee'
      >
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={isOpen}
            className={cn(
              'min-w-[120px] max-w-[175px] px-3 justify-start font-normal overflow-hidden hover:bg-transparent',
              borderHidden ? 'border-transparent hover:border-input' : ''
            )}
          >
            {value ? (
              <>
                <Avatar className='size-6'>
                  <AvatarFallback className='size-6'>
                    {value?.name?.at(0)}
                  </AvatarFallback>
                  <AvatarImage
                    src={value?.img}
                    alt='Profile photo'
                  />
                </Avatar>
                <p className='ml-2'>{value?.name}</p>
              </>
            ) : (
              <>
                <Users
                  className='size-4 mr-2 text-muted-foreground'
                  strokeWidth={1.5}
                />
                <span className='text-muted-foreground'>Assignee</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
      </Hint>
      <PopoverContent
        side='bottom'
        align='start'
        className='w-auto min-w-[120px] p-0'
      >
        <Command value={defaultValue}>
          <CommandInput placeholder='Assignee...' />
          <CommandList>
            <CommandEmpty>
              <span className='text-muted-foreground'>No member found</span>
            </CommandEmpty>
            {members && (
              <CommandGroup>
                {members.map(member => (
                  <CommandItem
                    key={member?._id}
                    value={`${member?._id} ${member?.fullName}`}
                    className='relative'
                    onSelect={() => {
                      setValue({
                        id: member?._id,
                        name: member?.fullName,
                        img: member?.image,
                      });
                      setField('assignee', member?._id);
                      setIsOpen(false);
                    }}
                  >
                    <Avatar className='size-7'>
                      <AvatarFallback className='size-7'>
                        {member.fullName?.charAt(0)}
                      </AvatarFallback>
                      <AvatarImage src={member?.image} />
                    </Avatar>
                    <p className='ml-2'>{member?.fullName}</p>
                    {value?.id === member?._id && (
                      <Check className='size-4 absolute right-2.5' />
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectMembers;
