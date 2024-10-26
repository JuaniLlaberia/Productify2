'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import type { UseFormSetValue } from 'react-hook-form';

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
  defaultValue,
}: {
  setField: UseFormSetValue<any>;
  defaultValue?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();

  const labels = useQuery(api.labels.getLabels, {
    teamId,
    projectId,
  });

  // Find and set the default label when labels are loaded
  useEffect(() => {
    if (labels && defaultValue) {
      const defaultLabel = labels.find(label => label._id === defaultValue);
      if (defaultLabel) {
        setSelectedLabel({
          id: defaultLabel._id,
          title: defaultLabel.title,
        });
      }
    }
  }, [labels, defaultValue]);

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
              <div className='flex items-center gap-2'>
                <Tag className='h-4 w-4' />
                <span className='truncate'>
                  {selectedLabel ? selectedLabel.title : 'Select label'}
                </span>
              </div>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>

        <TooltipContent>Set label</TooltipContent>
      </Tooltip>

      <PopoverContent className='p-0 w-[200px]'>
        <Command>
          <CommandInput placeholder='Search labels...' />
          <CommandList>
            <CommandEmpty>No label found</CommandEmpty>
            <CommandGroup>
              {labels?.map(label => (
                <CommandItem
                  value={label._id}
                  key={label._id}
                  onSelect={() => {
                    setSelectedLabel({
                      id: label._id,
                      title: label.title,
                    });
                    setField('label', label._id);
                    setIsOpen(false);
                  }}
                >
                  {label.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default SelectLabel;
