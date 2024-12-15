import { ColumnDef } from '@tanstack/react-table';
import { CalendarDays, Check, Hash, Lock, Type, Users, X } from 'lucide-react';
import { intlFormat } from 'date-fns';

import CustomTableHeader from '@/components/ui/table-header';
import { Doc } from '../../../../../../../convex/_generated/dataModel';

const CheckIcon = () => (
  <span className='bg-green-600 rounded-full p-0.5'>
    <Check className='size-2' strokeWidth={3} />
  </span>
);

const XIcon = () => (
  <span className='bg-red-600 rounded-full p-0.5'>
    <X className='size-2' strokeWidth={3} />
  </span>
);

export const channelColumns: ColumnDef<Doc<'channels'>>[] = [
  {
    id: 'select',
    enableResizing: false,
    size: 10,
    cell: ({ row }) => (
      <div className='flex justify-center items-center'>
        <span className='flex items-center justify-center group-hover:opacity-0 pointer-events-none text-muted-foreground/75 text-xs font-medium'>
          {row.index + 1}
        </span>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Channel name
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Type className='size-3 mr-1.5' />}
          label='Channel name'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const values = row.original;
      const name = values.name;
      const icon = values.icon;

      return (
        <p className='flex items-center justify-start px-2 gap-2'>
          <span>{icon || <Hash className='size-4' strokeWidth={1.5} />}</span>
          {name}
        </p>
      );
    },
    enableHiding: false,
  },
  // Member
  {
    accessorKey: 'isMember',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Users className='size-3 mr-1.5' />}
          label='Member'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className='px-2'>
          <p className='flex items-center gap-1.5'>
            {row.getValue('isMember') ? (
              <>
                <CheckIcon />
                <span className='text-sm'>Yes</span>
              </>
            ) : (
              <>
                <XIcon />
                <span className='text-sm'>No</span>
              </>
            )}
          </p>
        </div>
      );
    },
  },
  // Private
  {
    accessorKey: 'private',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Lock className='size-3 mr-1.5' />}
          label='Private'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className='px-2'>
          <p className='flex items-center gap-1.5'>
            {row.getValue('private') ? (
              <>
                <CheckIcon />
                <span className='text-sm'>Yes</span>
              </>
            ) : (
              <>
                <XIcon />
                <span className='text-sm'>No</span>
              </>
            )}
          </p>
        </div>
      );
    },
  },
  // Created at
  {
    accessorKey: '_creationTime',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<CalendarDays className='size-3 mr-1.5' />}
          label='Created at'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const creationDate = parseInt(row.getValue('_creationTime'));
      if (!creationDate)
        return <p className='px-2 text-muted-foreground/75'>Not assigned</p>;

      const formattedCreationDate = intlFormat(new Date(creationDate));
      return <p className='px-2 text-sm'>{formattedCreationDate}</p>;
    },
  },
  //In case we need to add actions for admins or users
  {
    id: 'actions',
    enableResizing: false,
    size: 10,
  },
];
