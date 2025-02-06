'use client';

import Link from 'next/link';
import { AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from 'convex/react';

import { Card } from '@/components/ui/card';
import { api } from '../../../../../convex/_generated/api';

const SelectTeamComponent = () => {
  const teams = useQuery(api.teams.getUserTeams);
  const user = useQuery(api.users.getUser);

  if (!teams || !user)
    return (
      <div className='flex flex-col items-center space-y-4'>
        <Loader2
          className='size-10 animate-spin'
          strokeWidth={1.5}
        />
        <div className='flex flex-col items-center'>
          <p className='text-xl font-semibold'>Loading teams</p>
          <p className='text-sm text-muted-foreground mt-1'>
            Please wait while we fetch your data
          </p>
        </div>
      </div>
    );

  return (
    <Card className='w-full max-w-lg border border-border shadow-xl bg-muted/30'>
      <div className='p-8 space-y-6'>
        <div className='space-y-2'>
          <p className='text-muted-foreground text-sm'>{user.email}</p>
          <h1 className='text-3xl font-semibold'>Select your team</h1>
        </div>

        <ul className='space-y-3'>
          {teams?.map(team => (
            <li key={team._id}>
              <Link
                href={`/team/${team._id}/projects`}
                className='flex items-center justify-between w-full p-4 bg-background/75 hover:bg-background border border-border rounded-md cursor-pointer transition-all group'
              >
                <span className='text-base font-medium'>{team.name}</span>
                <span className='opacity-0 group-hover:opacity-100'>
                  <ChevronRight
                    className='size-5 text-muted-foreground'
                    strokeWidth={2}
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {teams.length === 0 && (
          <p className='flex items-center justify-center gap-2 text-muted-foreground py-6'>
            <AlertTriangle className='size-4' />
            No teams found
          </p>
        )}

        <div className='space-y-1 text-start text-sm transition-colors pt-4'>
          <p className='text-muted-foreground'>
            Want to create another team?{' '}
            <Link
              href='/team/new'
              className='no-underline hover:text-white hover:underline'
            >
              Create team
            </Link>
          </p>
          <p className='text-muted-foreground'>
            Not seeing your team?{' '}
            <Link
              href='/'
              className='no-underline hover:text-white hover:underline'
            >
              Change account
            </Link>
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SelectTeamComponent;
