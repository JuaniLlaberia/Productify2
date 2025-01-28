import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type HeaderProps = {
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
  containersClassname?: string;
};

const Header = ({
  leftContent,
  rightContent,
  className,
  containersClassname,
}: HeaderProps) => {
  return (
    <nav
      className={cn(
        'w-full flex h-12 p-2 px-4 items-center justify-between border-b border-border',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center justify-center gap-2',
          containersClassname
        )}
      >
        {leftContent}
      </div>
      <div
        className={cn(
          'flex items-center justify-center gap-2',
          containersClassname
        )}
      >
        {rightContent}
      </div>
    </nav>
  );
};

export default Header;
