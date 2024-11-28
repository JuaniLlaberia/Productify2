import type { ReactNode } from 'react';

import Sidebar from './(components)/Sidebar';
import InnerSidebar from './(components)/InnerSidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from './(context)/SidebarContext';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';

const TeamLayout = ({
  children,
  params: { teamId },
}: {
  children: ReactNode;
  params: { teamId: string };
}) => {
  return (
    <div className='fixed inset-0 overflow-hidden'>
      <SidebarProvider>
        <TooltipProvider delayDuration={50}>
          <Sidebar teamId={teamId} />
          <ResizablePanelGroup
            direction='horizontal'
            autoSaveId='TEAMS_SIDEBAR'
          >
            <InnerSidebar />
            <ResizablePanel defaultSize={80}>
              <section className='w-full h-screen overflow-auto'>
                {children}
              </section>
            </ResizablePanel>
          </ResizablePanelGroup>
        </TooltipProvider>
      </SidebarProvider>
    </div>
  );
};

export default TeamLayout;
