import type { ReactNode } from 'react';
import Sidebar from './(components)/Sidebar';

const TeamLayout = ({
  children,
  params: { teamId },
}: {
  children: ReactNode;
  params: { teamId: string };
}) => {
  return (
    <div className='flex'>
      <Sidebar teamId={teamId} />
      <section className='w-full'>{children}</section>
    </div>
  );
};

export default TeamLayout;
