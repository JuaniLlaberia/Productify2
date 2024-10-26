'use client';

import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Bell, CircleHelp, LogOut, Settings, User } from 'lucide-react';

import ThemeButton from './ThemeButton';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const UserMenu = () => {
  const user = useQuery(api.users.getUser);
  if (!user) return <Skeleton className='size-10' />;

  return (
    <TooltipProvider delayDuration={150}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Tooltip>
            <TooltipTrigger>
              <Avatar className='rounded-lg size-10'>
                <AvatarFallback className='rounded-lg size-10'>
                  {user.fullName.at(0)?.toUpperCase()}
                </AvatarFallback>
                <AvatarImage src={user.profileImage} />
              </Avatar>
            </TooltipTrigger>
            <TooltipContent sideOffset={12} side='right'>
              {user.fullName}
            </TooltipContent>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='end' className='mb-1'>
          <DropdownMenuLabel className='flex items-center gap-3 font-normal'>
            <Avatar className='rounded-lg size-10'>
              <AvatarFallback>
                {user.fullName.at(0)?.toUpperCase()}
              </AvatarFallback>
              <AvatarImage src={user.profileImage} />
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
            <Link href='/settings'>
              <Settings className='size-4 mr-2' strokeWidth={1.5} />
              Settings
            </Link>
          </DropdownMenuItem>
          <ThemeButton />
          <DropdownMenuItem>
            <Bell className='size-4 mr-2' strokeWidth={1.5} />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href='/support'>
              <CircleHelp className='size-4 mr-2' strokeWidth={1.5} />
              Help & Support
            </Link>
          </DropdownMenuItem>
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
    </TooltipProvider>
  );
};

export default UserMenu;
