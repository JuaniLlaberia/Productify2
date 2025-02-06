'use client';

import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

import Logo from '@/components/Logo';
import AuthDialog from './AuthDialog';
import { Button } from '@/components/ui/button';
import { Authenticated, Unauthenticated } from 'convex/react';

const Footer = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <section className='flex flex-col justify-center items-center gap-4 lg:gap-6 py-32 lg:py-40 border- border-border-light dark:border-border-dark'>
        <h3 className='lg:flex lg:gap-2 text-text-light-2 text-center dark:text-text-dark-2 text-2xl lg:text-3xl'>
          <span className='flex items-center gap-2'>
            <Sparkles /> Organize your team &
          </span>
          <span className='bg-gradient-to-b from-orange-400 from-40% to-orange-600 bg-clip-text text-transparent'>
            {' '}
            be more efficient
          </span>
        </h3>
        <Unauthenticated>
          <AuthDialog
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            trigger={
              <Button
                size='sm'
                variant='outline'
                className='group'
              >
                Get started for free
                <ChevronRight className='size-4 ml-1.5 translate-x-1 group-hover:translate-x-2 transition-transform  ' />
              </Button>
            }
          />
        </Unauthenticated>
        <Authenticated>
          <Link
            href='/projects'
            className='group inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors h-8 rounded-md px-4 bg-background-1 border border-border-1 text-text-1 hover:bg-background-2'
          >
            My teams
            <ChevronRight className='size-4 ml-1.5 translate-x-1 group-hover:translate-x-2 transition-transform  ' />
          </Link>
        </Authenticated>
      </section>
      <footer className='flex items-center justify-between bg-muted/15 border-t border-border p-2 px-10 lg:px-32 xl:px-56'>
        <Logo />
        <p className='text-muted-foreground text-sm'>
          Copyright © {new Date().getFullYear()} Productify. All rights
          reserved.
        </p>
      </footer>
    </>
  );
};

export default Footer;
