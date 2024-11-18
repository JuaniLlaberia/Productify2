import ChatInput from '../(components)/ChannelInput';
import ChannelHeader from '../(components)/ChannelHeader';
import MessagesList from '../(components)/MessagesList';

const ChannelPage = () => {
  return (
    <section className='w-full h-full flex flex-col'>
      <ChannelHeader />
      <MessagesList />
      <ChatInput placeholder='Write your message' />
    </section>
  );
};

export default ChannelPage;
