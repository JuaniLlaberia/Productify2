'use client';

import { PanelRight, Settings2 } from 'lucide-react';
import { useParams } from 'next/navigation';

import Channel from './Channel';
import Hint from '@/components/ui/hint';
import { Button } from '@/components/ui/button';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { usePanel } from '../../../(context)/PanelContext';

const ChannelHeaderMenu = ({ channelId }: { channelId: Id<'channels'> }) => {
  const { teamId } = useParams<{ teamId: Id<'teams'> }>();
  const { openPanel, closePanel } = usePanel();

  const handleConversationSidebar = () => {
    openPanel({
      content: (
        <Channel
          key={channelId}
          teamId={teamId}
          channelId={channelId}
          onClose={closePanel}
        />
      ),
    });
  };

  return (
    <ul className='flex gap-2'>
      <li>
        <Hint label='Open in sidebar'>
          <Button
            size='icon'
            variant='ghost'
            onClick={handleConversationSidebar}
          >
            <PanelRight className='size-5' strokeWidth={1.5} />
          </Button>
        </Hint>
      </li>
      <li>
        <Hint label='Settings'>
          <Button size='icon' variant='ghost'>
            <Settings2 className='size-5' strokeWidth={1.5} />
          </Button>
        </Hint>
      </li>
    </ul>
  );
};

export default ChannelHeaderMenu;
