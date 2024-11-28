import { Hash } from 'lucide-react';

type ChannelHeaderProps = {
  channelName?: string;
  channelIcon?: string;
};

const ChannelHeader = ({ channelIcon, channelName }: ChannelHeaderProps) => {
  return (
    <nav className='flex items-center gap-2.5 w-full p-2 px-4 border-b border-border sticky top-0'>
      <div className='p-1 rounded bg-muted text-muted-foreground'>
        {channelIcon ? (
          channelIcon
        ) : (
          <Hash className='size-4' strokeWidth={1.5} />
        )}
      </div>
      <h1 className='text-sm font-medium'>{channelName}</h1>
    </nav>
  );
};

export default ChannelHeader;
