import { ColumnDef } from '@tanstack/react-table';
import {
  CalendarDays,
  Clock,
  FileIcon,
  FileText,
  HardDrive,
  ImageIcon,
  MoreHorizontal,
  Save,
  User,
} from 'lucide-react';
import { intlFormat } from 'date-fns';

import CustomTableHeader from '@/components/ui/table-header';
import AssetsActions from './AssetsActions';
import Badge from '@/components/ui/badge';
import { Doc } from '../../../../../../../convex/_generated/dataModel';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { formatFileSize } from '../../(components)/UploadAssetModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const assetsColumns: ColumnDef<
  Doc<'assets'> & {
    fileUrl?: string;
    createdBy: Doc<'users'>;
  }
>[] = [
  // Select
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
          <span className='absolute inset-0 flex items-center justify-center group-hover:opacity-0 pointer-events-none text-muted-foreground/75 text-xs font-medium'>
            {row.index + 1}
          </span>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={value => row.toggleSelected(!!value)}
            aria-label='Select row'
            className={cn(
              'relative z-10 opacity-0 group-hover:opacity-100',
              row.getIsSelected() && 'opacity-100'
            )}
          />
        </div>
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // Asset name
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<HardDrive className='size-3 mr-1.5' />}
          label='Asset name'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const values = row.original;
      const name = values.name;
      const url = values.fileUrl;
      const type = values.type;

      const isImage = type.includes('image');

      return (
        <a
          href={url}
          target='_blank'
          className='flex items-center justify-start px-2 gap-2 hover:underline hover:cursor-pointer'
        >
          <span>
            {isImage ? (
              <ImageIcon className='size-4' strokeWidth={1.5} />
            ) : (
              <FileText className='size-4' strokeWidth={1.5} />
            )}
          </span>
          {name}
        </a>
      );
    },
    enableHiding: false,
  },
  // Size
  {
    accessorKey: 'size',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Save className='size-3 mr-1.5' />}
          label='Size'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      return (
        <div className='px-2'>
          <p className='flex items-center gap-1.5'>
            {formatFileSize(row.getValue('size'))}
          </p>
        </div>
      );
    },
  },
  // Type
  {
    accessorKey: 'type',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<FileIcon className='size-3 mr-1.5' />}
          label='Type'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const fileType = row.getValue('type') as string;
      const type = fileType.split('/')[1];

      return (
        <div className='px-2'>
          <Badge
            decorated
            className='lowercase'
            text={type}
            color={fileType.includes('image') ? 'green' : 'blue'}
          />
        </div>
      );
    },
  },
  // Modified At
  {
    accessorKey: 'lastModified',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Clock className='size-3 mr-1.5' />}
          label='Last Modified'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const lastModified = parseInt(row.getValue('lastModified'));

      const formattedLastModified = intlFormat(new Date(lastModified));
      return <p className='px-2 text-sm'>{formattedLastModified}</p>;
    },
  },
  // Created at
  {
    accessorKey: '_creationTime',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<CalendarDays className='size-3 mr-1.5' />}
          label='Uploaded at'
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
  // Created By
  {
    accessorKey: 'createdBy',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<User className='size-3 mr-1.5' />}
          label='Created by'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const assignee = row.getValue('createdBy') as Doc<'users'>;

      if (!assignee)
        return <p className='px-2 text-muted-foreground/75'>Not assigned</p>;

      return (
        <div className='flex items-center gap-2 px-2'>
          <Avatar className='size-5'>
            <AvatarFallback className='size-5'>
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
      return <AssetsActions data={row.original} />;
    },
  },
];
