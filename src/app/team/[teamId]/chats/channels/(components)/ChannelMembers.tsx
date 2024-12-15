import { UserPlus, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Id } from '../../../../../../../convex/_generated/dataModel';

type ChannelMembersProps = {
  channelId: Id<'channels'>;
  onClose: () => void;
};

const ChannelMembers = ({ channelId, onClose }: ChannelMembersProps) => {
  return (
    <div className='h-full flex flex-col space-y-2'>
      <div className='h-12 flex justify-between items-center p-4 border-b'>
        <p className='text-sm'>Channel members</p>
        <Button onClick={onClose} variant='ghost' size='icon'>
          <X className='size-4' strokeWidth={1.5} />
        </Button>
      </div>
      <ul>Members list</ul>
      <Button size='sm'>
        <UserPlus className='size-4 mr-1.5' />
        Add members
      </Button>
    </div>
  );
};

export default ChannelMembers;
