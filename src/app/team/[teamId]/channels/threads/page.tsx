import { MessageSquareText } from 'lucide-react';

import ChannelHeader from '../(components)/ChannelHeader';
import ThreadsList from './(components)/ThreadsList';

const ThreadsPage = () => {
  return (
    <section className='w-full h-screen flex flex-col'>
      <ChannelHeader
        channelName='Threads'
        channelIcon={<MessageSquareText className='size-4' strokeWidth={1.5} />}
      />
      <ThreadsList />
    </section>
  );
};

export default ThreadsPage;
