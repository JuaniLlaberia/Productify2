import { format } from 'date-fns';

type ChatHeroProps = {
  name: string;
  creationTime: number;
};

const ChatHero = ({ name, creationTime }: ChatHeroProps) => {
  return (
    <div className='mt-[88px] mx-5 mb-4'>
      <p className='text-2xl font-bold flex items-center mb-2'># {name}</p>
      <p className='font-normal text-muted-foreground mb-4'>
        This channel was created on {format(creationTime, 'MMMM do, yyyy')}.
        This is the beginning of the <strong>{name}</strong> channel.
      </p>
    </div>
  );
};

export default ChatHero;
