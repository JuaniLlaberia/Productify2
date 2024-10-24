'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useDebouncedCallback } from 'use-debounce';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useCreateQueryString } from '@/hooks/useCreateQueryString';

export default function SearchbarFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCreateQueryString();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const searchValue = searchParams.get('search');

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchValue) return;
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchValue]);

  const handleSearch = useDebouncedCallback((value: string) => {
    router.push(pathname + '?' + createQueryString('search', value));
  }, 500);

  return (
    <div ref={containerRef} className='relative'>
      <div className='flex items-center'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type='button'
              onClick={() => {
                setIsOpen(prev => !prev);

                if (isOpen) {
                  router.push(pathname + '?' + createQueryString('search', ''));
                  if (inputRef.current) inputRef.current.value = '';
                }
              }}
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
          </TooltipTrigger>
          <TooltipContent>Search</TooltipContent>
        </Tooltip>
        <div
          className={cn(
            'overflow-hidden transition-all',
            isOpen ? 'w-64 opacity-100' : 'w-0 opacity-0'
          )}
        >
          <Input
            ref={inputRef}
            defaultValue={searchValue ?? ''}
            onChange={e => handleSearch(e.target.value)}
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
