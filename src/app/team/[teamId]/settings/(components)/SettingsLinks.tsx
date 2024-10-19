'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Blocks,
  Mail,
  Settings,
  TriangleAlert,
  Users,
  Workflow,
} from 'lucide-react';

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
          <li key={link.link}>
            <Link
              href={`/team/${teamId}/settings/${link.link}`}
              className={cn(
                'flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm hover:bg-gray-200',
                pathname.includes(link.link) ? 'bg-gray-200' : null
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SettingsLinks;
