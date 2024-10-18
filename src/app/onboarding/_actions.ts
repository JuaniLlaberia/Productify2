'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';

export const completeClerkOnboarding = async () => {
  const { userId } = auth();
  if (!userId) throw new Error('User is not logged in');

  try {
    const res = await clerkClient().users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });

    return { message: res.publicMetadata };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    return { error: 'There was an error updating the metadata' };
  }
};
