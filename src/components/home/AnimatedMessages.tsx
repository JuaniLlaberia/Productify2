'use client';

import { cn } from '@/lib/utils';
import { AnimatedList } from '../animated-list';
import { Avatar, AvatarFallback } from '../ui/avatar';

interface Item {
  name: string;
  message: string;
  time: string;
}

let messages = [
  {
    name: 'John Doe',
    message: 'All tasks have been updated.',
    time: '15m ago',
  },
  {
    name: 'James Lopez',
    message: 'I have requested the new feature.',
    time: '1h ago',
  },
  {
    name: 'Susan Morris',
    message: 'Hello team, how are you?',
    time: '3h ago',
  },
  {
    name: 'Pedro Martinez',
    message: 'I just fixed refactoring the auth',
    time: '30m ago',
  },
  {
    name: 'Martha Smith',
    message: 'Can you join the meetting in 10m please?',
    time: 'Now ago',
  },
];

messages = Array.from({ length: 10 }, () => messages).flat();

const Message = ({ name, message, time }: Item) => {
  return (
    <figure
      className={cn(
        'relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4',
        'transition-all duration-200 ease-in-out hover:scale-[103%]',
        'bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]',
        'transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]'
      )}
    >
      <div className='flex flex-row items-center gap-3'>
        <div className='flex size-10 items-center justify-center rounded-2xl'>
          <Avatar>
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        <div className='flex flex-col overflow-hidden'>
          <figcaption className='flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white '>
            <span className='text-sm sm:text-lg'>{name}</span>
            <span className='mx-1'>·</span>
            <span className='text-xs text-gray-500'>{time}</span>
          </figcaption>
          <p className='text-sm font-normal dark:text-white/60'>{message}</p>
        </div>
      </div>
    </figure>
  );
};

export function AnimatedMessages({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative flex h-[500px] w-full flex-col overflow-hidden rounded-lg border bg-background p-6 md:shadow-xl',
        className
      )}
    >
      <AnimatedList>
        {messages.map((item, idx) => (
          <Message
            {...item}
            key={idx}
          />
        ))}
      </AnimatedList>
    </div>
  );
}
