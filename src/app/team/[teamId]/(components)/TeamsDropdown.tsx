'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from 'convex/react';

import { api } from '../../../../../convex/_generated/api';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const TeamsDropdown = ({ currentTeamId }: { currentTeamId: string }) => {
  const teams = useQuery(api.teams.getUserTeams);
  if (!teams) return <Skeleton className='size-10' />;

  const crrTeam = teams.find(team => team?._id === currentTeamId);

  return (
    <TooltipProvider delayDuration={150}>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Tooltip>
            <TooltipTrigger>
              <Avatar className='rounded-lg size-10'>
                <AvatarFallback className='rounded-lg size-10'>
                  {crrTeam?.name.at(0)?.toUpperCase()}
                </AvatarFallback>
                <AvatarImage src={crrTeam?.imageUrl} />
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side='right' sideOffset={12}>
              {crrTeam?.name}
            </TooltipContent>
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right'>
          <ul>
            {teams.map(team => (
              <DropdownMenuItem key={team?._id} asChild>
                <Link href={`/team/${team?._id}`}>
                  <Avatar className='rounded-lg size-8'>
                    <AvatarFallback className='rounded-lg size-8'>
                      {team?.name.at(0)?.toUpperCase()}
                    </AvatarFallback>
                    <AvatarImage src={team?.imageUrl} />
                  </Avatar>
                  <p className='text-sm ml-3'>{team?.name}</p>
                  {team?._id === currentTeamId ? (
                    <Check className='size-4 ml-8' strokeWidth={1.5} />
                  ) : null}
                </Link>
              </DropdownMenuItem>
            ))}
          </ul>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default TeamsDropdown;
