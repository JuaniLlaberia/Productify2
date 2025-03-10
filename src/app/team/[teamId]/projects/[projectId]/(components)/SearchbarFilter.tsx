'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';

import Hint from '@/components/ui/hint';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useTable } from '@/components/TableContext';
import { useClickOutside } from '@/hooks/useClickOutside';

export default function SearchbarFilter({ field }: { field: string }) {
  const { table } = useTable();
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useClickOutside(containerRef, () => {
    if (isOpen && !inputRef.current?.value) {
      setIsOpen(false);
      table?.getColumn(field)?.setFilterValue(null);
    }
  });

  const handleSearchToggle = () => {
    setIsOpen(prev => {
      if (prev && inputRef.current) {
        inputRef.current.value = '';
        table?.getColumn(field)?.setFilterValue(null);
      }
      return !prev;
    });
  };

  if (!table) return null;

  return (
    <div ref={containerRef} className='relative'>
      <div className='flex items-center'>
        <Hint label='Search'>
          <Button
            type='button'
            onClick={handleSearchToggle}
            size='icon'
            variant='outline'
            className={cn(
              'relative z-10 transition-all',
              isOpen && 'rounded-r-none border-r-0'
            )}
          >
            {isOpen ? (
              <X className='absolute size-4 text-muted-foreground' />
            ) : (
              <Search className='size-4' />
            )}
            <span className='sr-only'>
              {isOpen ? 'Close search' : 'Open search'}
            </span>
          </Button>
        </Hint>
        <div
          className={cn(
            'overflow-hidden transition-all',
            isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
          )}
        >
          <Input
            ref={inputRef}
            value={table.getColumn(field)?.getFilterValue() as string}
            onChange={event =>
              table.getColumn(field)?.setFilterValue(event.target.value)
            }
            placeholder='Search'
            className={cn(
              'h-8 rounded-l-none border-l-0 focus-visible:ring-0 focus-visible:ring-offset-0',
              !isOpen && 'w-0 p-0'
            )}
          />
        </div>
      </div>
    </div>
  );
}
