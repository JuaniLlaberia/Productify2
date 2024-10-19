import type { ReactNode } from 'react';
import Sidebar from './(components)/Sidebar';

const TeamLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex'>
      <Sidebar />
      <section className='w-full'>{children}</section>
    </div>
  );
};

export default TeamLayout;
