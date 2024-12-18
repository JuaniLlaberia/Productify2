import { ColumnDef } from '@tanstack/react-table';
import { AtSign, MapPin, Tag, User } from 'lucide-react';

import CustomTableHeader from '@/components/ui/table-header';
import MembersActions from './MembersActions';
import MemberRoleInput from './MemberRoleInput';
import { RolesEnum } from '@/lib/enums';
import { Doc, Id } from '../../../../../../../convex/_generated/dataModel';
import { Avatar, AvatarImage } from '@/components/ui/avatar';

export const membersColumns: ColumnDef<
  Doc<'users'> & { role: RolesEnum; memberId: Id<'members'> }
>[] = [
  // Full anme
  {
    accessorKey: 'fullName',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<User className='size-3 mr-1.5' />}
          label='Full name'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const values = row.original;
      const fullName = values.fullName;
      const image = values.profileImage;

      return (
        <div className='flex items-center gap-1.5 px-1.5'>
          <Avatar className='size-7 shrink-0'>
            <AvatarImage src={image} alt='Profile photo' />
          </Avatar>
          <p className='px-2'>{fullName}</p>
        </div>
      );
    },
    enableHiding: false,
  },
  // Email
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<AtSign className='size-3 mr-1.5' />}
          label='Email address'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      return <p className='px-2'>{row.getValue('email')}</p>;
    },
  },
  // Role
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<Tag className='size-3 mr-1.5' />}
          label='Role'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const values = row.original;
      const role = values.role;
      const memberId = values.memberId;

      return <MemberRoleInput role={role} memberId={memberId} />;
    },
  },
  // Location
  {
    accessorKey: 'location',
    header: ({ column }) => {
      return (
        <CustomTableHeader
          icon={<MapPin className='size-3 mr-1.5' />}
          label='Location'
          column={column}
        />
      );
    },
    cell: ({ row }) => {
      const location = row.getValue('location') as string;
      if (!location)
        return <p className='px-2 text-muted-foreground/75'>Not provided</p>;

      return <p className='px-2 text-sm'>{location}</p>;
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
      return <MembersActions member={data} />;
    },
  },
];
