'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Check, Users } from 'lucide-react';
import type { FieldValues, UseFormSetValue } from 'react-hook-form';

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const SelectMembers = ({
  setField,
}: {
  setField: UseFormSetValue<FieldValues>;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<
    | {
        id?: string;
        name?: string;
        img?: string;
      }
    | undefined
  >(undefined);

  const { teamId, projectId } = useParams();
  const members = useQuery(api.projects.getProjectMembers, {
    teamId: teamId as Id<'teams'>,
    projectId: projectId as Id<'projects'>,
  });

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant='outline'
              role='combobox'
              aria-expanded={isOpen}
              className='min-w-[120px] max-w-[175px] px-3 justify-start font-normal overflow-hidden'
            >
              {value ? (
                <>
                  <Avatar className='rounded-lg size-7'>
                    <AvatarFallback className='rounded-lg size-7'>
                      {value?.name?.at(0)}
                    </AvatarFallback>
                    <AvatarImage src={value?.img} />
                  </Avatar>
                  <p className='ml-2'>{value?.name}</p>
                </>
              ) : (
                <>
                  <Users
                    className='size-4 mr-2 text-muted-foreground'
                    strokeWidth={1.5}
                  />
                  Assignee
                </>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Set assignee</TooltipContent>
      </Tooltip>
      <PopoverContent
        side='bottom'
        align='start'
        className='w-auto min-w-[120px] p-0'
      >
        <Command>
          <CommandInput placeholder='Assignee...' />
          <CommandList>
            <CommandEmpty>
              <span className='text-muted-foreground'>No member found</span>
            </CommandEmpty>
            {members ? (
              <CommandGroup>
                {members.map(member => (
                  <CommandItem
                    key={member?._id}
                    value={member?.fullName}
                    className='relative'
                    onSelect={() => {
                      setValue({
                        id: member?._id,
                        name: member?.fullName,
                        img: member?.profileImage,
                      });
                      setField('assignee', member?._id);
                      setIsOpen(false);
                    }}
                  >
                    <Avatar className='rounded-lg size-7'>
                      <AvatarFallback className='rounded-lg size-7'>
                        {member?.fullName.at(0)}
                      </AvatarFallback>
                      <AvatarImage src={member?.profileImage} />
                    </Avatar>
                    <p className='ml-2'>{member?.fullName}</p>
                    {value?.id === member?._id ? (
                      <Check className='size-4 absolute right-2.5' />
                    ) : null}
                  </CommandItem>
                ))}
              </CommandGroup>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectMembers;
