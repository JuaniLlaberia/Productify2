'use client';

import { ListFilter } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import SearchbarFilter from './SearchbarFilter';
import FiltersForm, { Filter } from './FiltersForm';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useCreateQueryString } from '@/hooks/useCreateQueryString';
import { ColumnVisibilityDropdown } from '@/components/TableContext';

type View = {
  id: string;
  label: string;
  value: string;
  icon: ReactElement;
};

type NavbarProps = {
  filters?: Filter[];
  views?: View[];
  defaultView?: View['value'];
  createModal?: ReactNode;
  createButtonLabel?: string;
};

const ProjectFeatureNavbar = ({
  filters,
  views = [],
  defaultView,
  createModal,
}: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCreateQueryString();

  const searchParams = useSearchParams();
  const view = searchParams.get('view') || 'table';

  return (
    <nav className='w-full p-2 px-4 border-b border-border'>
      <div className='flex items-center justify-between'>
        {/* Filters */}
        <div className='flex items-center space-x-2'>
          {filters ? (
            <Popover>
              <PopoverTrigger>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='outline' size='sm'>
                      <ListFilter className='size-4 mr-1.5' strokeWidth={1.5} />
                      Filters
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Filters</TooltipContent>
                </Tooltip>
              </PopoverTrigger>
              <PopoverContent side='bottom' className='w-auto'>
                <FiltersForm filters={filters} />
              </PopoverContent>
            </Popover>
          ) : null}
          {view === 'table' ? (
            <>
              <ColumnVisibilityDropdown />
              <SearchbarFilter />
            </>
          ) : null}
        </div>

        {/* VIEW COMPONENT */}
        <div className='flex items-center justify-center gap-2'>
          {views.length > 1 ? (
            <Tabs
              defaultValue={defaultView}
              onValueChange={value => {
                router.push(pathname + '?' + createQueryString('view', value));
              }}
            >
              <TabsList>
                {views.map(view => (
                  <Tooltip key={view.id}>
                    <TooltipTrigger className='h-full'>
                      <TabsTrigger value={view.value} className='h-full'>
                        {view.icon}
                      </TabsTrigger>
                    </TooltipTrigger>
                    <TooltipContent>{view.label}</TooltipContent>
                  </Tooltip>
                ))}
              </TabsList>
            </Tabs>
          ) : null}

          {/* Create component */}
          {createModal ? createModal : null}
        </div>
      </div>
    </nav>
  );
};

export default ProjectFeatureNavbar;
