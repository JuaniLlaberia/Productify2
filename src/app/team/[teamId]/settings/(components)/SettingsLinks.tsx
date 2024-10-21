'use client';

import { usePathname } from 'next/navigation';
import {
  Blocks,
  Mail,
  Settings,
  TriangleAlert,
  Users,
  Workflow,
} from 'lucide-react';

import InnerSidebarLink from '../../(components)/InnerSidebarLinks';
import { Id } from '../../../../../../convex/_generated/dataModel';

const TEAM_SETTINGS_LINKS = [
  {
    label: 'General',
    link: 'general',
    icon: <Settings className='size-4' strokeWidth={1.5} />,
  },
  {
    label: 'Members',
    link: 'members',
    icon: <Users className='size-4' strokeWidth={1.5} />,
  },
  {
    label: 'Invitations',
    link: 'invitations',
    icon: <Mail className='size-4' strokeWidth={1.5} />,
  },
  {
    label: 'Integrations',
    link: 'integrations',
    icon: <Blocks className='size-4' strokeWidth={1.5} />,
  },
  {
    label: 'Automations',
    link: 'automations',
    icon: <Workflow className='size-4' strokeWidth={1.5} />,
  },
  {
    label: 'Danger Zone',
    link: 'danger-zone',
    icon: <TriangleAlert className='size-4' strokeWidth={1.5} />,
  },
];

const SettingsLinks = ({ teamId }: { teamId: Id<'teams'> }) => {
  const pathname = usePathname();

  return (
    <>
      <h3 className='flex items-center justify-between text-xs uppercase font-semibold text-muted-foreground mb-2'>
        <span className='py-0.5'>Team settings</span>
      </h3>
      <ul className='flex flex-col gap-0.5 mb-4'>
        {TEAM_SETTINGS_LINKS.map(link => (
          <InnerSidebarLink
            key={link.link}
            label={link.label}
            icon={link.icon}
            link={`/team/${teamId}/settings/${link.link}`}
            isActive={pathname.includes(link.link)}
          />
        ))}
      </ul>
    </>
  );
};

export default SettingsLinks;
