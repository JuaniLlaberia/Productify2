import {
  FileText,
  Folder,
  Link as LinkIcon,
  MessagesSquare,
  Settings,
} from 'lucide-react';

import UserMenu from './UserMenu';
import TeamsDropdown from './TeamsDropdown';
import SidebarLink from './SidebarLink';
import { Separator } from '@/components/ui/separator';

const SIDEBAR_LINKS = [
  {
    label: 'Projects',
    tooltip: 'Projects',
    link: 'projects',
    icon: <Folder className='size-5' strokeWidth={1.5} />,
  },
  {
    label: 'Channels',
    tooltip: 'Channels',
    link: 'channels',
    icon: <MessagesSquare className='size-5' strokeWidth={1.5} />,
  },
  {
    label: 'Docs',
    tooltip: 'Documents',
    link: 'documents',
    icon: <FileText className='size-5' strokeWidth={1.5} />,
  },
  {
    label: 'Assets',
    tooltip: 'Assents & Links',
    link: 'assets',
    icon: <LinkIcon className='size-5' strokeWidth={1.5} />,
  },
  {
    label: 'Settings',
    tooltip: 'Settings',
    link: 'settings',
    icon: <Settings className='size-5' strokeWidth={1.5} />,
  },
];

const Sidebar = ({ teamId }: { teamId: string }) => {
  return (
    <aside className='h-screen w-[80px] flex flex-col items-center p-2 pt-5 py-3 bg-gray-100 border-r border-border'>
      <div className='flex flex-1 flex-col gap-3 items-center'>
        <TeamsDropdown />

        <ul className='flex flex-col gap-3'>
          {SIDEBAR_LINKS.map(link => (
            <SidebarLink
              key={link.link}
              {...link}
              link={`/team/${teamId}/${link.link}`}
            />
          ))}
        </ul>
      </div>
      <Separator className='my-3' />
      <UserMenu />
    </aside>
  );
};

export default Sidebar;
