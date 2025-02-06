'use client';

import { cn } from '@/lib/utils';
import { AnimatedBeam } from '../animated-beam';
import { forwardRef, useRef } from 'react';
import { Bug, CheckSquare } from 'lucide-react';

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'z-10 flex size-12 items-center justify-center rounded-full border-2 bg-muted p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]',
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = 'Circle';

export const ReportsAnimation = ({ className }: { className?: string }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        'relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border bg-background p-10 md:shadow-xl',
        className
      )}
      ref={containerRef}
    >
      <div className='flex size-full flex-col items-stretch justify-between gap-10'>
        <div className='flex flex-row justify-between text-muted-foreground'>
          <Circle ref={div1Ref}>
            <Bug />
          </Circle>
          <Circle ref={div2Ref}>
            <CheckSquare />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        duration={2}
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
      />
    </div>
  );
};
