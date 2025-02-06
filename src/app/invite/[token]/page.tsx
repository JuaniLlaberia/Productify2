'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useEffect } from 'react';

import { api } from '../../../../convex/_generated/api';

const JoinTeamPage = ({ params: { token } }: { params: { token: string } }) => {
  const router = useRouter();
  const joinTeam = useMutation(api.inviteCodes.joinTeamWithCode);

  const handleJoinTeam = async () => {
    try {
      console.log('calling fn to join team');
      const teamId = await joinTeam({ token });
      console.log('Fn finished and returned this ID', teamId);

      router.push(`/team/${teamId}/projects`);

      toast.success('You have joined the team successfully', {
        description: 'Redirecting to your team page',
      });
    } catch (error) {
      console.error('Team join error:', error);

      toast.error('Failed to join team', {
        description:
          error instanceof Error
            ? error.message
            : 'Please try again or contact the team owner',
      });
    }
  };

  useEffect(() => {
    handleJoinTeam();
  }, [token]);

  return (
    <section className='flex flex-col items-center justify-center w-full h-screen'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='flex flex-col items-center space-y-6 text-center'
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        >
          <Loader2
            className='size-14'
            strokeWidth={1.5}
          />
        </motion.div>
        <h1 className='text-2xl font-semibold text-gray-800 dark:text-gray-100'>
          Joining team
        </h1>
        <motion.p
          className='max-w-md text-gray-600 dark:text-gray-300'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          It may take a bit. You will be redirected automatically.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default JoinTeamPage;
