'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Id } from '../../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../../convex/_generated/api';

interface TemplatesPopoverProps {
  setValue: UseFormSetValue<any>;
}

const TemplatesPopover = ({ setValue }: TemplatesPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();

  const templates = useQuery(api.templates.getProjectTemplates, {
    teamId,
    projectId,
    filters: {},
  });

  const applyTemplate = (template: any) => {
    // Set each field with shouldDirty: true and shouldTouch: true
    const fields = [
      ['title', template.title],
      ['description', template.description],
      ['status', template.status],
      ['priority', template.priority],
      ['label', template.label?._id],
      ['assignee', template.assignee?._id],
    ] as const;

    // Update all fields
    fields.forEach(([field, value]) => {
      if (value !== undefined) {
        setValue(field, value, {
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    });

    // Handle date separately due to conversion
    if (template.dueDate) {
      setValue('date', new Date(template.dueDate), {
        shouldDirty: true,
        shouldTouch: true,
      });
    }

    setPopoverOpen(false);
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button size='sm' variant='outline'>
              Use templates
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Use template</TooltipContent>
      </Tooltip>
      <PopoverContent align='start' side='top' className='p-0 w-[200px]'>
        <Command>
          <CommandInput placeholder='Search templates...' />
          <CommandList>
            <CommandEmpty>No templates found</CommandEmpty>
            <CommandGroup>
              {templates?.map(template => (
                <CommandItem
                  value={`${template._id} ${template.title}`}
                  key={template._id}
                  onSelect={() => applyTemplate(template)}
                >
                  {template.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TemplatesPopover;
