'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { FieldValues, UseFormSetValue } from 'react-hook-form';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from './tooltip';

export function DatePicker({
  setValue,
}: {
  setValue: UseFormSetValue<FieldValues>;
}) {
  const [date, setDate] = React.useState<Date>();

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant={'outline'}
              className={cn(
                'min-w-[120px] max-w-[200px] justify-start text-left font-normal'
              )}
            >
              <CalendarIcon
                className='mr-2 size-4 shrink-0 text-muted-foreground'
                strokeWidth={1.5}
              />
              {date ? (
                format(date, 'PPP')
              ) : (
                <span className='text-primary'>Due date</span>
              )}
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Set date</TooltipContent>
      </Tooltip>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={selected => {
            setValue('date', selected);
            setDate(selected);
          }}
          disabled={date => date < new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
