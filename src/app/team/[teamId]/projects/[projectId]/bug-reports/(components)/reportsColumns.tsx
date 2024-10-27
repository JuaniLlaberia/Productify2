'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CalendarDays, Clock, Tag, Type } from 'lucide-react';
import { intlFormat } from 'date-fns';

import CustomTableHeader from '@/components/ui/table-header';
import ReportsActions from './ReportsActions';
import Badge, { ColorsType } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { PRIORITY_COLORS } from '@/lib/consts';
import { PriorityEnum, ReportTypeEnum } from '@/lib/enums';
import { Doc } from '../../../../../../../../convex/_generated/dataModel';

export const reportsColumns: ColumnDef<Doc<'reports'>>[] = [
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
  // Type
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Tag className='size-3 mr-1.5' />}
          label='Type'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const type = row.getValue('type') as ReportTypeEnum;
      return (
        <div className='px-2'>
          <Badge decorated text={type} color='purple' />
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
  // Creation date
  {
    accessorKey: '_creationTime',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<CalendarDays className='size-3 mr-1.5' />}
          label='Creation date'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const creationTime = parseInt(row.getValue('_creationTime'));
      if (!creationTime) return '';

      const formattedCreationTime = intlFormat(new Date(creationTime));
      return <p className='px-2 text-sm'>{formattedCreationTime}</p>;
    },
  },
  // Actions
  {
    id: 'actions',
    enableResizing: false,
    size: 10,
    cell: ({ row }) => {
      const data = row.original;
      return <ReportsActions data={data} />;
    },
  },
];
