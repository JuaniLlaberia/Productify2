import { usePathname } from 'next/navigation';
import { type ReactElement, ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type SidebarExpandItemProps = {
  id: string;
  title: string;
  icon: string | ReactElement;
  trigger?: ReactElement;
  options?: ReactElement;
  expandIcon?: boolean;
  links: ReactNode;
};

const SidebarExpandItemV2 = ({
  id,
  title,
  icon,
  trigger,
  options,
  expandIcon = false,
  links,
}: SidebarExpandItemProps) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState<boolean>(pathname.includes(id));

  const handleExpandClick = (e: React.MouseEvent) => {
    // Only toggle if clicking the main area or chevron, not the options
    if (!(e.target as HTMLElement).closest('.options-area')) {
      setIsOpen(prev => !prev);
    }
  };

  return (
    <li>
      <div
        className={cn(
          'flex items-center justify-between w-full group cursor-pointer',
          !isOpen && 'mb-1.5'
        )}
        onClick={handleExpandClick}
      >
        <p className='flex items-center text-nowrap line-clamp-1'>
          <span
            className={cn(
              'mr-1.5 size-6 flex items-center justify-center',
              `${isOpen ? 'bg-muted' : 'group-hover:bg-muted'} px-0.5 py-1 rounded`
            )}
          >
            {icon}
          </span>
          <span className='text-sm'>{title}</span>
        </p>
        <div
          className='flex items-center gap-2 options-area'
          onClick={e => e.stopPropagation()}
        >
          <div className='space-x-2 opacity-100 md:opacity-0 md:[&:has([data-state="open"])]:opacity-100 group-hover:opacity-100'>
            {trigger && trigger}
            {options && options}
            {expandIcon && (
              <Button
                size='icon-sm'
                variant='ghost'
                onClick={handleExpandClick}
              >
                <ChevronDown
                  className={cn(
                    'size-4 transition-transform',
                    !isOpen && '-rotate-90'
                  )}
                />
              </Button>
            )}
          </div>
        </div>
      </div>
      {isOpen && <ul className='flex flex-col mt-1 min-h-2'>{links}</ul>}
    </li>
  );
};

export default SidebarExpandItemV2;
