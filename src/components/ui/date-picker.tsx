'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import type { UseFormSetValue } from 'react-hook-form';

import Hint from './hint';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePicker({
  setValue,
  defaultValue,
  borderHidden,
}: {
  setValue: UseFormSetValue<any>;
  defaultValue?: Date;
  borderHidden?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<Date | undefined>(defaultValue);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <Hint side={borderHidden ? 'left' : 'top'} label='Set date'>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'min-w-[120px] max-w-[200px] justify-start text-left font-normal hover:bg-transparent',
              borderHidden ? 'border-transparent hover:border-input' : ''
            )}
          >
            <CalendarIcon
              className='mr-2 size-4 shrink-0 text-muted-foreground'
              strokeWidth={1.5}
            />
            {date ? (
              format(date, 'PP')
            ) : (
              <span className='text-muted-foreground'>Due date</span>
            )}
          </Button>
        </PopoverTrigger>
      </Hint>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          selected={date}
          onSelect={selected => {
            if (selected) {
              setValue('date', selected);
              setDate(selected);
              setIsOpen(false);
            }
          }}
          disabled={date => date < new Date()}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
