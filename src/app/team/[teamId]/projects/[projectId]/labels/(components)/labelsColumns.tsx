'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PaintBucket, Type } from 'lucide-react';

import CustomTableHeader from '@/components/ui/table-header';
import LabelsActions from './LabelsActions';
import Badge, { ColorsType } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Doc } from '../../../../../../../../convex/_generated/dataModel';

export const labelsColumns: ColumnDef<Doc<'labels'>>[] = [
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
  // Color
  {
    accessorKey: 'color',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<PaintBucket className='size-3 mr-1.5' />}
          label='Color'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const color = row.getValue('color') as ColorsType;
      return (
        <div className='px-2'>
          <Badge decorated text={color} color={color} />
        </div>
      );
    },
  },
  // Actions
  {
    id: 'actions',
    enableResizing: false,
    enableHiding: false,
    size: 10,
    cell: ({ row }) => {
      const data = row.original;
      return <LabelsActions data={data} />;
    },
  },
];
