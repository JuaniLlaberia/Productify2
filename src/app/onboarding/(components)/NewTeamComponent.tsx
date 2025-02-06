'use client';

import {
  Heart,
  MessageCircle,
  Sparkles,
  TriangleAlert,
  Users,
  Workflow,
} from 'lucide-react';

import CreateTeamForm from './CreateTeamForm';
import { Card } from '@/components/ui/card';
import { useAuthActions } from '@convex-dev/auth/react';

const PRODUCTIFY_FEATURES = [
  {
    label: 'Plan your team work',
    icon: <Users className='size-5' />,
  },
  {
    label: 'Super easy to setup',
    icon: <Heart className='size-5' />,
  },
  {
    label: 'Seamless platform integrations',
    icon: <Workflow className='size-5' />,
  },
  {
    label: 'AI assistance',
    icon: <Sparkles className='size-5' />,
  },
  {
    label: 'Real-time chat with team',
    icon: <MessageCircle className='size-5' />,
  },
  {
    label: 'Track and report bugs with ease',
    icon: <TriangleAlert className='size-5' />,
  },
];

const NewTeamComponent = () => {
  const { signOut } = useAuthActions();

  return (
    <section className='flex items-center justify-center h-screen p-4 lg:p-8'>
      <div className='flex gap-10'>
        <div className='w-full'>
          <h5 className='text-2xl font-bold'>Producify</h5>
          <h1 className='text-4xl font-semibold py-1'>Create Your Team</h1>
          <p className='text-muted-foreground'>
            Everything your team needs to collaborate, plan, and execute
            projects efficiently.
          </p>
          <ul className='flex flex-col gap-3 mt-10 pl-5'>
            {PRODUCTIFY_FEATURES.map(feature => (
              <li
                className='flex gap-3'
                key={feature.label}
              >
                {feature.icon}
                <p className='text-themeTextGray'>{feature.label}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='w-full'>
          <Card className='p-4 max-w-[450px]'>
            <h2 className='text-lg font-semibold'>Your Team</h2>
            <p className='text-muted-foreground mb-6'>
              Teams are fully customizable, you can manage it&apos;s information
              and members once it&apos;s created.
            </p>
            <CreateTeamForm />
            <p className='text-sm mt-3 text-muted-foreground'>
              Need to change account?{' '}
              <button
                onClick={signOut}
                className='text-primary font-medium hover:underline'
              >
                Sign out here
              </button>
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default NewTeamComponent;
