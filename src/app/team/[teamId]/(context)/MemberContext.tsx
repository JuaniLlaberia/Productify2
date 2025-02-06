'use client';

import { useParams, useRouter } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Id } from '../../../../../convex/_generated/dataModel';
import { useMemberRole } from '@/features/auth/api/useMemberRole';

const MemberContext = createContext(undefined);

export const MemberProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const { isLoading, isMember } = useMemberRole(teamId);

  useEffect(() => {
    if (isLoading) return;

    if (!isMember) {
      toast.error('You are not a member of this team.', {
        description: 'You are being redirected',
      });
      return router.push('/team/select');
    }
  }, [teamId, isMember, router, isLoading]);

  if (isLoading)
    return (
      <div className='flex items-center justify-center h-full'>
        <div className='flex flex-col items-center space-y-4'>
          <Loader2
            className='size-10 animate-spin'
            strokeWidth={1.5}
          />
          <div className='flex flex-col items-center'>
            <p className='text-xl font-semibold'>Loading data</p>
            <p className='text-sm text-muted-foreground mt-1'>
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <MemberContext.Provider value={undefined}>
      {children}
    </MemberContext.Provider>
  );
};

export const useMemberContext = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
};
