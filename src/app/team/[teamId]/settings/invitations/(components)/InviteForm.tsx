'use client';

import { Check, Copy, RefreshCcw } from 'lucide-react';
import { useMutation, useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

import SettingsCard from '../../(components)/SettingsCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { Skeleton } from '@/components/ui/skeleton';

const InviteForm = () => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const { copyToClipboard, isCopied } = useCopyToClipboard({ options: {} });

  const updateTeamCode = useMutation(api.inviteCodes.updateTeamCode);

  const teamCode = useQuery(api.inviteCodes.getTeamCode, { teamId });
  if (!teamCode) return <Skeleton className='h-48 w-full max-w-[600px]' />;

  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${teamCode.token}`;

  return (
    <div className='space-y-2.5'>
      <SettingsCard
        title='Invite link'
        description='Share this link to invite new team members'
      >
        <div className='space-y-2'>
          <div className='flex items-center space-x-2'>
            <Input readOnly className='flex-grow h-9' value={link} />
            <Button size='sm' onClick={() => copyToClipboard(link)}>
              {isCopied ? (
                <>
                  <Check className='h-4 w-4 mr-2' />
                  Copied
                </>
              ) : (
                <>
                  <Copy className='h-4 w-4 mr-2' />
                  Copy
                </>
              )}
            </Button>
          </div>
          {/* <Button variant='outline' size='sm'>
        <RefreshCcw className='h-4 w-4 mr-2' />
        Generate New Link
      </Button> */}
        </div>
      </SettingsCard>
    </div>
  );
};

export default InviteForm;
