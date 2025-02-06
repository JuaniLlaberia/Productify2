import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { SignUpButton, SignedIn, SignedOut } from '@clerk/nextjs';

import DotPattern from './DotPattern';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AnimatedShinyText } from '../animated-shiny-text';

const Hero = () => {
  return (
    <>
      <section className='z-[100] flex flex-col items-center justify-center text-center my-5 py-56 px-8 md:py-40 md:px-16 lg:py-64 lg:px-72'>
        <div
          className={cn(
            'mb-3 md:mb-6 rounded-full border border-border/50 transition-all ease-in hover:cursor-pointer bg-muted/30 hover:bg-muted/20'
          )}
        >
          <AnimatedShinyText className='inline-flex items-center justify-center text-sm px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400 lg:text-sm'>
            <span>🎉 Productify 2.0 Beta is here. Try it for free!</span>
          </AnimatedShinyText>
        </div>
        <h1 className='bg-gradient-to-b from-neutral-950 dark:from-zinc-100 from-40% to-stone-400 dark:to-slate-300 bg-clip-text text-transparent text-3xl/[45px] md:text-5xl/[70px] lg:text-7xl/[100px]'>
          Organize your team
        </h1>
        <h2 className='bg-gradient-to-b from-orange-400 from-40% to-orange-600 bg-clip-text text-transparent text-3xl md:text-5xl lg:text-6xl'>
          Be more efficient
        </h2>
        <p className='text-muted-foreground max-w-xl mt-4 mb-6 text-sm md:text-base lg:text-lg lg:mt-5 lg:mb-10'>
          Embrace a new era of productivity and collaboration today. Everything
          you need in one app. Just be more productive.
        </p>
        <SignedOut>
          <div className='flex items-center gap-3'>
            <SignUpButton mode='modal'>
              <Button
                variant='outline'
                className='group'
              >
                Get started for free
                <ChevronRight className='size-4 ml-1.5 translate-x-1 group-hover:translate-x-2 transition-transform  ' />
              </Button>
            </SignUpButton>
            <Link
              className={cn(
                buttonVariants({ variant: 'link' }),
                'text-muted-foreground hover:text-primary'
              )}
              href=''
            >
              More info
            </Link>
          </div>
        </SignedOut>
        <SignedIn>
          <Link
            href='/team/select'
            className='group inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors h-8 rounded-md px-4 bg-background-1 border border-border-1 text-text-1 hover:bg-background-2'
          >
            My projects
            <ChevronRight className='size-4 ml-1.5 translate-x-1 group-hover:translate-x-2 transition-transform  ' />
          </Link>
        </SignedIn>
      </section>
      <DotPattern className='z-10 pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/25 [mask-image:linear-gradient(to_bottom_right,white,transparent)]' />
      <div className='w-full absolute bottom-0 bg-gradient-to-b from-transparent to-white dark:to-background h-10'></div>
    </>
  );
};

export default Hero;
