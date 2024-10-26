import type { ReactNode } from 'react';
import Sidebar from './(components)/Sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';

const TeamLayout = ({
  children,
  params: { teamId },
}: {
  children: ReactNode;
  params: { teamId: string };
}) => {
  return (
    <div className='flex'>
      <TooltipProvider delayDuration={150}>
        <Sidebar teamId={teamId} />
        <section className='w-full'>{children}</section>
      </TooltipProvider>
    </div>
  );
};

export default TeamLayout;
