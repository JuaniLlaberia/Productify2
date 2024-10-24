'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { Tag } from 'lucide-react';
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const SelectLabel = ({
  setField,
}: {
  setField: UseFormSetValue<FieldValues>;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string>('');

  const { teamId, projectId } = useParams();
  const labels = useQuery(api.labels.getLabels, {
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
              <Tag
                className='size-4 mr-2 text-muted-foreground'
                strokeWidth={1.5}
              />
              {value || 'Label'}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Set label</TooltipContent>
      </Tooltip>
      <PopoverContent
        side='bottom'
        align='start'
        className='w-auto min-w-[120px] p-0'
      >
        <Command>
          <CommandInput placeholder='Label...' />
          <CommandList>
            <CommandEmpty>
              <span className='text-muted-foreground'>No label found</span>
            </CommandEmpty>
            {labels ? (
              <CommandGroup>
                {labels.map(label => (
                  <CommandItem
                    key={label._id}
                    value={label.title}
                    className='relative'
                    onSelect={() => {
                      setValue(label.title);
                      setField('label', label._id);
                      setIsOpen(false);
                    }}
                  >
                    {label?.title}
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

export default SelectLabel;
