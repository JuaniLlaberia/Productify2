'use client';

import { usePaginatedQuery } from 'convex/react';
import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { LayoutPanelTop } from 'lucide-react';

import Hint from '@/components/ui/hint';
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
import { Id } from '../../../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../../../convex/_generated/api';

interface TemplatesPopoverProps {
  teamId: Id<'teams'>;
  projectId: Id<'projects'>;
  setValue: UseFormSetValue<any>;
}

const TemplatesPopover = ({
  teamId,
  projectId,
  setValue,
}: TemplatesPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);

  const templates = usePaginatedQuery(
    api.templates.getProjectTemplates,
    {
      teamId,
      projectId,
      filters: {},
    },
    { initialNumItems: 1000000 }
  );

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
      <Hint label='Use template'>
        <PopoverTrigger asChild>
          <Button size='sm' variant='outline'>
            Use templates
          </Button>
        </PopoverTrigger>
      </Hint>
      <PopoverContent align='start' side='top' className='p-0 w-[200px]'>
        <Command>
          <CommandInput placeholder='Search templates...' />
          <CommandList>
            <CommandEmpty>No templates found</CommandEmpty>
            <CommandGroup>
              {templates?.results.map(template => (
                <CommandItem
                  value={`${template._id} ${template.title}`}
                  key={template._id}
                  onSelect={() => applyTemplate(template)}
                >
                  <LayoutPanelTop className='size-4 mr-2.5' strokeWidth={1.5} />
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
