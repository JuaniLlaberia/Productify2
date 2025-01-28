import { Skeleton } from '@/components/ui/skeleton';

const MembersLoader = () => {
  return (
    <div className='space-y-3 p-2.5'>
      <div className='flex items-center justify-end'>
        <Skeleton className='w-32 h-8' />
      </div>
      <div className='space-y-1.5'>
        <Skeleton className='w-full h-10' />
        <Skeleton className='w-full h-10' />
        <Skeleton className='w-full h-10' />
      </div>
    </div>
  );
};

export default MembersLoader;
