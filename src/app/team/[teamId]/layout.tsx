import type { ReactNode } from 'react';

import Sidebar from './(components)/Sidebar';
import InnerSidebar from './(components)/InnerSidebar';
import Panel from './(components)/Panel';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from './(context)/SidebarContext';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { PanelProvider } from './(context)/PanelContext';
import { MemberProvider } from './(context)/MemberContext';

const TeamLayout = ({
  children,
  params: { teamId },
}: {
  children: ReactNode;
  params: { teamId: string };
}) => {
  return (
    <div className='fixed inset-0 overflow-hidden'>
      <MemberProvider>
        <SidebarProvider>
          <PanelProvider>
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
                <Panel />
              </ResizablePanelGroup>
            </TooltipProvider>
          </PanelProvider>
        </SidebarProvider>
      </MemberProvider>
    </div>
  );
};

export default TeamLayout;
