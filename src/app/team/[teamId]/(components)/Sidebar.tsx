'use client';

import {
  FileText,
  Folder,
  MessagesSquare,
  PanelRightClose,
  PanelRightOpen,
  Server,
  Settings,
} from 'lucide-react';

import UserMenu from './UserMenu';
import TeamsDropdown from './TeamsDropdown';
import SidebarLink from './SidebarLink';
import Hint from '@/components/ui/hint';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useSidebar } from '../(context)/SidebarContext';

const SIDEBAR_LINKS = [
  {
    label: 'Projects',
    tooltip: 'Projects',
    link: 'projects/my-tasks',
    activeKey: 'projects',
    icon: <Folder className='size-5' strokeWidth={1.5} />,
  },
  {
    label: 'Chats',
    tooltip: 'Chats',
    link: 'chats',
    activeKey: 'chats',
    icon: <MessagesSquare className='size-5' strokeWidth={1.5} />,
  },
  {
    label: 'Docs',
    tooltip: 'Documents',
    link: 'documents',
    activeKey: 'documents',
    icon: <FileText className='size-5' strokeWidth={1.5} />,
  },
  {
    label: 'Storages',
    tooltip: 'Storages & Assets',
    link: 'storages',
    activeKey: 'storages',
    icon: <Server className='size-5' strokeWidth={1.5} />,
  },
  {
    label: 'Settings',
    tooltip: 'Settings',
    link: 'settings/general',
    activeKey: 'settings',
    icon: <Settings className='size-5' strokeWidth={1.5} />,
  },
];

const Sidebar = ({ teamId }: { teamId: string }) => {
  const { isOpen, toggleSidebar } = useSidebar();

  return (
    <aside className='h-screen w-[80px] flex flex-col items-center p-2 pt-5 py-3 bg-muted/50 dark:bg-muted/25 border-r border-border'>
      <div className='space-y-1'>
        <TeamsDropdown />
        <Hint label={`${isOpen ? 'Close' : 'Open'} menu`} side='right'>
          <Button
            className='flex flex-col items-center size-10 rounded-lg'
            variant='ghost'
            size='icon'
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <PanelRightOpen className='size-5' strokeWidth={1.5} />
            ) : (
              <PanelRightClose className='size-5' strokeWidth={1.5} />
            )}
          </Button>
        </Hint>
      </div>
      <Separator className='my-3' />

      <ul className='flex flex-1 flex-col gap-3 items-center'>
        {SIDEBAR_LINKS.map(link => (
          <SidebarLink
            key={link.link}
            {...link}
            link={`/team/${teamId}/${link.link}`}
          />
        ))}
      </ul>

      <Separator className='my-3' />
      <UserMenu />
    </aside>
  );
};

export default Sidebar;
