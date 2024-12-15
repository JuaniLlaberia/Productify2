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

  const getFirstLetter = (name?: string) => name?.at(0)?.toUpperCase() || 'T';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Hint label={crrTeam?.name || 'Team'} side='right'>
          <Avatar>
            <AvatarFallback>{getFirstLetter(crrTeam?.name)}</AvatarFallback>
            {crrTeam?.imageUrl && (
              <AvatarImage
                src={crrTeam.imageUrl}
                alt={crrTeam.name || 'Team'}
              />
            )}
          </Avatar>
        </Hint>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' align='start'>
        <div className='p-2'>
          <h6 className='text-sm font-medium'>{crrTeam?.name || 'Team'}</h6>
          <p className='text-sm text-muted-foreground'>Active team</p>
        </div>
        <DropdownMenuSeparator />
        <ul>
          {teams.map(team => (
            <DropdownMenuItem key={team?._id || 'team-item'} asChild>
              <Link href={`/team/${team?._id || ''}`}>
                <Avatar className='size-7'>
                  <AvatarFallback className='size-7'>
                    {getFirstLetter(team?.name)}
                  </AvatarFallback>
                  {team?.imageUrl && (
                    <AvatarImage
                      src={team.imageUrl}
                      alt={team.name || 'Team'}
                    />
                  )}
                </Avatar>
                <p className='text-sm ml-3'>{team?.name || 'Unnamed Team'}</p>
                {team?._id === teamId && (
                  <Check className='size-4 ml-8' strokeWidth={1.5} />
                )}
              </Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuItem asChild className='pr-6'>
            <Link href='/teams/new'>
              <span className='flex items-center justify-center rounded-lg size-7 bg-transparent'>
                <Plus className='size-4' strokeWidth={1.5} />
              </span>
              <p className='text-sm ml-3'>Create a new team</p>
            </Link>
          </DropdownMenuItem>
        </ul>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default TeamsDropdown;
