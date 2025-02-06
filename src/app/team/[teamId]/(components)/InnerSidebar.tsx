'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

import ProjectsLinks from '../projects/(components)/ProjectsLinks';
import StoragesLinks from '../storages/(components)/StoragesLinks';
import ChatLinks from '../chats/(components)/ChatLinks';
import SettingsLinks from '../settings/(components)/SettingsLinks';
import { useSidebar } from '../(context)/SidebarContext';
import { cn } from '@/lib/utils';
import { ResizableHandle, ResizablePanel } from '@/components/ui/resizable';

const SIDEBAR_CONTENT: {
  [key: string]: { title: string; content: ReactNode };
} = {
  projects: { title: 'Projects', content: <ProjectsLinks /> },
  chats: { title: 'Chats', content: <ChatLinks /> },
  storages: { title: 'Storages', content: <StoragesLinks /> },
  settings: { title: 'Settings', content: <SettingsLinks /> },
};

const InnerSidebar = () => {
  const pathname = usePathname();
  const { isOpen } = useSidebar();

  const matchingKey = Object.keys(SIDEBAR_CONTENT).find(key =>
    pathname.includes(key)
  );

  const { title, content } = matchingKey
    ? SIDEBAR_CONTENT[matchingKey]
    : { title: 'Default', content: <p>No Content Available</p> };

  return (
    <>
      <ResizablePanel
        className={cn(
          'bg-muted/50 dark:bg-muted/25 h-screen p-4 py-5',
          !isOpen ? 'hidden' : ''
        )}
        defaultSize={18}
        maxSize={30}
        minSize={12}
      >
        <h2 className='text-lg font-semibold'>{title}</h2>
        <div className='py-2 mt-4'>{content}</div>
      </ResizablePanel>
      <ResizableHandle
        withHandle
        className={!isOpen ? 'hidden' : ''}
      />
    </>
  );
};

export default InnerSidebar;
