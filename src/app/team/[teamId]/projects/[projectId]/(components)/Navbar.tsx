'use client';

import {
  Edit,
  ListFilter,
  LogOut,
  Plus,
  Settings,
  Trash2,
  Users,
} from 'lucide-react';
import { ReactElement, ReactNode } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';

import SearchbarFilter from './SearchbarFilter';
import FiltersForm, { Filter } from './FiltersForm';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useCreateQueryString } from '@/hooks/useCreateQueryString';
import { ColumnVisibilityDropdown } from '@/components/TableContext';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';

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

const ProjectsNavbar = ({
  filters,
  views = [],
  defaultView,
  createModal,
  createButtonLabel,
}: NavbarProps) => {
  const { teamId, projectId } = useParams<{
    teamId: Id<'teams'>;
    projectId: Id<'projects'>;
  }>();
  const pathname = usePathname();
  const router = useRouter();
  const createQueryString = useCreateQueryString();

  const projectData = useQuery(api.projects.getProjectById, {
    teamId,
    projectId,
  });

  return (
    <nav className='w-full p-2 px-4 border-b border-border'>
      <TooltipProvider delayDuration={150}>
        <div className='flex items-center justify-between'>
          <Breadcrumb>
            <BreadcrumbList>
              <div className='p-1 rounded bg-muted text-muted-foreground'>
                😎
              </div>
              <BreadcrumbItem>Projects</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{projectData?.name}</BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className='capitalize'>
                {pathname.split('/').at(-1)}
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <DropdownMenu>
            <Tooltip>
              <DropdownMenuTrigger asChild>
                <TooltipTrigger>
                  <Button size='sm' variant='outline'>
                    <Settings className='size-4 mr-1.5' strokeWidth={1.5} />
                    Settings
                  </Button>
                </TooltipTrigger>
              </DropdownMenuTrigger>
              <TooltipContent>Project settings</TooltipContent>
            </Tooltip>
            <DropdownMenuContent side='bottom' align='end'>
              <DropdownMenuItem>
                <Users className='size-4 mr-2' strokeWidth={1.5} />
                Members
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Edit className='size-4 mr-2' strokeWidth={1.5} />
                Edit project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 className='size-4 mr-2' strokeWidth={1.5} />
                Delete project
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className='size-4 mr-2' strokeWidth={1.5} />
                Leave project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator className='my-2' />
        <div className='flex items-center justify-between'>
          {/* Filters */}
          <div className='flex items-center space-x-2'>
            {filters ? (
              <Popover>
                <PopoverTrigger>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant='outline' size='sm'>
                        <ListFilter
                          className='size-4 mr-1.5'
                          strokeWidth={1.5}
                        />
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
            <ColumnVisibilityDropdown />
            <SearchbarFilter />
          </div>

          {/* VIEW COMPONENT */}
          <div className='flex items-center justify-center gap-2'>
            {views.length > 1 ? (
              <Tabs
                defaultValue={defaultView}
                onValueChange={value => {
                  router.push(
                    pathname + '?' + createQueryString('view', value)
                  );
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
            {createModal ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button size='sm'>
                    <Plus className='size-4 mr-1.5' strokeWidth={2} />
                    {createButtonLabel ?? 'New'}
                  </Button>
                </DialogTrigger>
                <DialogContent>{createModal}</DialogContent>
              </Dialog>
            ) : null}
          </div>
        </div>
      </TooltipProvider>
    </nav>
  );
};

export default ProjectsNavbar;
