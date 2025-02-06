'use client';

import { useAuthActions } from '@convex-dev/auth/react';
import type { Dispatch, SetStateAction, ReactElement } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GoogleLogo } from '../GoogleLogo';
import { GitHubLogo } from '../GithubLogo';

type AuthDialogProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  trigger?: ReactElement;
};

const AuthDialog = ({ isOpen, setIsOpen, trigger }: AuthDialogProps) => {
  const { signIn } = useAuthActions();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <div className='space-y-1 flex flex-col items-center mb-4'>
          <DialogTitle className='text-2xl'>Welcome to Productify</DialogTitle>
          <DialogDescription>
            To use Productify you must log into an account or create one.
          </DialogDescription>
        </div>

        <div className='flex flex-col gap-2 px-10'>
          <Button
            className='flex-1'
            variant='outline'
            type='button'
            onClick={() => signIn('google')}
          >
            <GoogleLogo className='mr-2 size-4' /> Google
          </Button>
          <Button
            className='flex-1'
            variant='outline'
            type='button'
            onClick={() => signIn('github')}
          >
            <GitHubLogo className='mr-2 size-4' /> GitHub
          </Button>
        </div>

        <DialogFooter className='justify-center mt-3'>
          <p className='text-sm text-muted-foreground text-center'>
            By using Productify, you accept our terms and policies.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuthDialog;
