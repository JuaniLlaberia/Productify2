'use client';

import { useQuery } from 'convex/react';
import { Mail, MapPin, X } from 'lucide-react';

import Badge from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { api } from '../../../../../convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

type UserPanelProps = {
  onClose: () => void;
};

const UserPanel = ({ onClose }: UserPanelProps) => {
  const user = useQuery(api.users.getUser);

  if (!user)
    return (
      <section className='h-full flex flex-col'>
        <div className='h-12 flex justify-between items-center p-4 border-b'>
          <Skeleton className='w-32 h-full' />
          <Button onClick={onClose} variant='ghost' size='icon'>
            <X className='size-4' strokeWidth={1.5} />
          </Button>
        </div>
        <div className='w-full max-w-md mx-auto p-4'>
          <div className='flex flex-row items-center gap-4 pb-2'>
            <Skeleton className='w-20 h-20 rounded-full' />
            <div className='flex flex-col space-y-2'>
              <Skeleton className='h-6 w-32' />
              <Skeleton className='h-4 w-24' />
            </div>
          </div>
          <div className='space-y-4'>
            <div className='flex items-center'>
              <Skeleton className='w-4 h-4 mr-2' />
              <Skeleton className='h-4 w-40' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-[90%]' />
              <Skeleton className='h-4 w-[80%]' />
            </div>
          </div>
        </div>
      </section>
    );

  const { fullName, profileImage, email, description, location } = user;

  return (
    <section className='h-full flex flex-col'>
      <div className='h-12 flex justify-between items-center p-4 border-b'>
        <p className='text-sm'>{fullName}</p>
        <Button onClick={onClose} variant='ghost' size='icon'>
          <X className='size-4' strokeWidth={1.5} />
        </Button>
      </div>
      <div className='p-4 space-y-3'>
        <div className='flex flex-row items-center gap-4 pb-2'>
          <Avatar className='size-20'>
            <AvatarFallback>{fullName.at(0)?.toUpperCase()}</AvatarFallback>
            <AvatarImage src={profileImage} />
          </Avatar>
          <div className='flex flex-col gap-1'>
            <h2 className='text-xl'>{fullName}</h2>
            <div>
              <Badge
                color='gray'
                text={
                  <>
                    <MapPin className='size-3 mr-1.5' />
                    {location || 'Location'}
                  </>
                }
              />
            </div>
          </div>
        </div>
        <div>
          <h3 className='text-xs text-muted-foreground font-medium mb-1'>
            CONTACT INFORMATION
          </h3>
          <div className='flex items-center mb-3'>
            <Mail className='size-4 mr-2 text-muted-foreground' />
            <a href={`mailto:${email}`} className='text-sm hover:underline'>
              {email}
            </a>
          </div>
          <h3 className='text-xs text-muted-foreground font-medium mb-1'>
            DESCRIPTION
          </h3>
          {description ? (
            <p className='text-sm'>{description}</p>
          ) : (
            <p className='text-sm text-muted-foreground'>No description</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default UserPanel;
