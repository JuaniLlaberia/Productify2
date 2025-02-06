'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import Logo from '../Logo';
import AuthDialog from './AuthDialog';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Authenticated, Unauthenticated } from 'convex/react';

const LandingHeader = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <header className='w-full fixed top-0 z-[100] flex justify-between items-center bg-background p-2 px-10 lg:px-32 xl:px-56 border-b border-border'>
      <Logo />
      <div>
        <Unauthenticated>
          <AuthDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            trigger={
              <Button
                size='sm'
                className='group font-medium'
              >
                Get started
                <ChevronRight className='size-4 ml-1.5 translate-x-1 group-hover:translate-x-2 transition-transform' />
              </Button>
            }
          />
          <AuthDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            trigger={
              <Button
                size='sm'
                variant='outline'
                className='ml-3'
              >
                Log In
              </Button>
            }
          />
        </Unauthenticated>
        <Authenticated>
          <div className='flex items-center gap-3'>
            <Link
              href='/team/select'
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'group'
              )}
            >
              My teams
              <ChevronRight className='size-4 ml-1.5  translate-x-1 group-hover:translate-x-2 transition-transform' />
            </Link>
          </div>
        </Authenticated>
      </div>
    </header>
  );
};

export default LandingHeader;
