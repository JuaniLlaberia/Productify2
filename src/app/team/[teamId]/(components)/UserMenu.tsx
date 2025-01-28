'use client';

import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { LogOut, Settings, User } from 'lucide-react';

import ThemeButton from './ThemeButton';
import Hint from '@/components/ui/hint';
import { api } from '../../../../../convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useParams } from 'next/navigation';
import { Id } from '../../../../../convex/_generated/dataModel';

const UserMenu = () => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();

  const user = useQuery(api.users.getUser);
  if (!user) return <Skeleton className='size-10' />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Hint label={user.fullName} side='right'>
          <Avatar>
            <AvatarFallback>
              {user.fullName.at(0)?.toUpperCase()}
            </AvatarFallback>
            <AvatarImage src={user.profileImage} alt='Profile photo' />
          </Avatar>
        </Hint>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='end' className='mb-1'>
        <DropdownMenuLabel className='flex items-center gap-3 font-normal'>
          <Avatar>
            <AvatarFallback>
              {user.fullName.at(0)?.toUpperCase()}
            </AvatarFallback>
            <AvatarImage src={user.profileImage} alt='Profile photo' />
          </Avatar>
          <div>
            <p className='font-semibold'>{user.fullName}</p>
            <p className='text-xs text-muted-foreground'>{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href='/settings/profile'>
            <User className='size-4 mr-2' strokeWidth={1.5} />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/team/${teamId}/settings/general`}>
            <Settings className='size-4 mr-2' strokeWidth={1.5} />
            Settings
          </Link>
        </DropdownMenuItem>
        <ThemeButton />
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className='w-full'>
          <SignOutButton>
            <button className='w-full'>
              <LogOut className='size-4 mr-2' strokeWidth={1.5} />
              Sign out
            </button>
          </SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
