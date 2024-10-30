'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Clock, Shapes, Tag, Type, User } from 'lucide-react';

import CustomTableHeader from '@/components/ui/table-header';
import TemplatesActions from './TemplatesActions';
import Badge, { ColorsType } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { PRIORITY_COLORS, STATUS_COLORS } from '@/lib/consts';
import { PriorityEnum, StatusEnum } from '@/lib/enums';
import { Doc } from '../../../../../../../../convex/_generated/dataModel';

export type PopulatedTemplates = Omit<
  Doc<'templates'>,
  'assignee' | 'label'
> & {
  assignee: Doc<'users'> | null;
  label: Doc<'labels'> | null;
};

export const templatesColumns: ColumnDef<PopulatedTemplates>[] = [
  {
    id: 'select',
    enableResizing: false,
    size: 10,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <div className='group flex items-center'>
        <div className='relative'>
          <span className='absolute inset-0 flex items-center justify-center group-hover:opacity-0 pointer-events-none text-muted-foreground text-xs font-medium'>
            {row.index + 1}
          </span>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label='Select row'
            className={cn(
              'relative z-10 opacity-0 group-hover:opacity-100',
              row.getIsSelected() ? 'opacity-100' : null
            )}
          />
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Title
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Type className='size-3 mr-1.5' />}
          label='Title'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      return <p className='px-2'>{row.getValue('title')}</p>;
    },
    enableHiding: false,
  },
  // Status
  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Shapes className='size-3 mr-1.5' />}
          label='Status'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const status = row.getValue('status') as StatusEnum;
      if (!status)
        return <p className='px-2 text-muted-foreground/75'>Not assigned</p>;

      return (
        <div className='px-2'>
          <Badge
            decorated
            text={status}
            color={STATUS_COLORS[status] as ColorsType}
          />
        </div>
      );
    },
  },
  // Priority
  {
    accessorKey: 'priority',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Clock className='size-3 mr-1.5' />}
          label='Priority'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const priority = row.getValue('priority') as PriorityEnum;
      if (!priority)
        return <p className='px-2 text-muted-foreground/75'>Not assigned</p>;

      return (
        <div className='px-2'>
          <Badge
            text={priority}
            decorated
            color={PRIORITY_COLORS[priority] as ColorsType}
          />
        </div>
      );
    },
  },
  // Label
  {
    accessorKey: 'label',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Tag className='size-3 mr-1.5' />}
          label='Label'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const label = row.getValue('label') as Doc<'labels'>;
      if (!label)
        return <p className='px-2 text-muted-foreground/75'>Not assigned</p>;

      return (
        <div className='px-2'>
          <Badge
            text={label.title}
            decorated
            color={label.color as ColorsType}
          />
        </div>
      );
    },
  },
  // Assignee
  {
    accessorKey: 'assignee',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<User className='size-3 mr-1.5' />}
          label='Assignee'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const assignee = row.getValue('assignee') as Doc<'users'>;

      if (!assignee)
        return <p className='px-2 text-muted-foreground'>Not assigned</p>;

      return (
        <div className='flex items-center gap-2 px-2'>
          <Avatar className='size-5 rounded-lg'>
            <AvatarFallback className='size-5 rounded-lg'>
              {assignee.fullName.at(0)}
            </AvatarFallback>
            <AvatarImage src={assignee.profileImage} />
          </Avatar>
          <p>{assignee.fullName}</p>
        </div>
      );
    },
  },
  // Actions
  {
    id: 'actions',
    enableResizing: false,
    size: 10,
    cell: ({ row }) => {
      const data = row.original;
      return <TemplatesActions data={data} />;
    },
  },
];
