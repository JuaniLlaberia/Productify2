'use client';

import Link from 'next/link';
import { Check, Plus } from 'lucide-react';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

import Hint from '@/components/ui/hint';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { api } from '../../../../../convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const TeamsDropdown = () => {
  const { teamId } = useParams();
  const teams = useQuery(api.teams.getUserTeams);
  if (!teams) return <Skeleton className='size-10' />;

  const crrTeam = teams.find(team => team?._id === teamId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Hint label={crrTeam?.name || 'T'} side='right'>
          <Avatar className='rounded-lg size-10'>
            <AvatarFallback className='rounded-lg size-10'>
              {crrTeam?.name.at(0)?.toUpperCase()}
            </AvatarFallback>
            <AvatarImage src={crrTeam?.imageUrl} />
          </Avatar>
        </Hint>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='start'>
        <ul>
          {teams.map(team => (
            <DropdownMenuItem key={team?._id} asChild>
              <Link href={`/team/${team?._id}`}>
                <Avatar className='rounded-lg size-7'>
                  <AvatarFallback className='rounded-lg size-7'>
                    {team?.name.at(0)?.toUpperCase()}
                  </AvatarFallback>
                  <AvatarImage src={team?.imageUrl} />
                </Avatar>
                <p className='text-sm ml-3'>{team?.name}</p>
                {team?._id === teamId ? (
                  <Check className='size-4 ml-8' strokeWidth={1.5} />
                ) : null}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href='/teams/new'>
              <span className='flex items-center justify-center rounded-lg size-7 bg-transparent'>
                <Plus className='size-4' strokeWidth={1.5} />
              </span>
              <p className='text-sm ml-3'>New team</p>
            </Link>
          </DropdownMenuItem>
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamsDropdown;
