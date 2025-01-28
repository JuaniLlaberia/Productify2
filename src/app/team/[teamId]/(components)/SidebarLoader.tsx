import { Skeleton } from '@/components/ui/skeleton';

const SidebarLoader = () => {
  return (
    <ul className='flex flex-col gap-2'>
      <li>
        <Skeleton className='w-full h-6' />
      </li>
      <li>
        <Skeleton className='w-full h-6' />
      </li>
      <li>
        <Skeleton className='w-full h-6' />
      </li>
      <li>
        <Skeleton className='w-full h-6' />
      </li>
      <li>
        <Skeleton className='w-full h-6' />
      </li>
    </ul>
  );
};

export default SidebarLoader;
