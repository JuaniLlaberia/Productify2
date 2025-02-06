import Link from 'next/link';
import { SignInButton, SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';
import { ChevronRight } from 'lucide-react';

import Logo from '../Logo';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const LandingHeader = () => {
  return (
    <header className='w-full fixed top-0 z-[100] flex justify-between items-center bg-background p-2 px-10 lg:px-32 xl:px-56 border-b border-border'>
      <Logo />
      <div>
        <SignedOut>
          <SignUpButton mode='modal'>
            <Button
              size='sm'
              className='group font-medium'
            >
              Get started
              <ChevronRight className='size-4 ml-1.5 translate-x-1 group-hover:translate-x-2 transition-transform' />
            </Button>
          </SignUpButton>
          <SignInButton mode='modal'>
            <Button
              size='sm'
              variant='outline'
              className='ml-3'
            >
              Log In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <div className='flex items-center gap-3'>
            <Link
              href='/team/select'
              className={cn(
                buttonVariants({ variant: 'outline', size: 'sm' }),
                'group'
              )}
            >
              My projects
              <ChevronRight className='size-4 ml-1.5  translate-x-1 group-hover:translate-x-2 transition-transform' />
            </Link>
          </div>
        </SignedIn>
      </div>
    </header>
  );
};

export default LandingHeader;
