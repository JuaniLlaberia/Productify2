import { Skeleton } from '@/components/ui/skeleton';

const MessageLoader = () => {
  return (
    <li className='flex items-start space-x-4 p-4'>
      <Skeleton className='size-10 shrink-0' />
      <div className='space-y-2 flex-1'>
        <Skeleton className='h-4 w-32' />
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-64' />
      </div>
    </li>
  );
};

export default MessageLoader;
