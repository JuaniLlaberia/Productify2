'use client';

import { Users } from 'lucide-react';
import { useQuery } from 'convex/react';

import SettingsHeader from '../(components)/SettingsHeader';
import { DataTable } from '@/components/ui/data-table';
import { membersColumns } from './(components)/membersColumns';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { TableProvider } from '@/components/TableContext';

const MembersSettingsPage = ({
  params: { teamId },
}: {
  params: { teamId: Id<'teams'> };
}) => {
  const members = useQuery(api.teams.getTeamMembers, { teamId });

  if (!members) return <p>Loading</p>;

  return (
    <TableProvider>
      <section>
        <SettingsHeader
          title='Team members'
          icon={<Users className='size-4' strokeWidth={2} />}
        />
        <DataTable data={members} columns={membersColumns} />
      </section>
    </TableProvider>
  );
};

export default MembersSettingsPage;
