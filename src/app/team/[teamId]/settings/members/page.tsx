'use client';

import { Users } from 'lucide-react';

import SettingsHeader from '../(components)/SettingsHeader';
import { DataTable } from '@/components/ui/data-table';
import { membersColumns } from './(components)/membersColumns';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { TableProvider } from '@/components/TableContext';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';

const MembersSettingsPage = ({
  params: { teamId },
}: {
  params: { teamId: Id<'teams'> };
}) => {
  const { results, isLoading } = useStablePaginatedQuery(
    api.teams.getTeamMembers,
    { teamId },
    { initialNumItems: 10 }
  );

  return (
    <TableProvider>
      <section>
        <SettingsHeader
          title='Team members'
          icon={<Users className='size-4' strokeWidth={2} />}
        />
        <DataTable
          // @ts-expect-error No idea what this typescript error is
          data={results}
          // @ts-expect-error No idea what this typescript error is
          columns={membersColumns}
          isLoading={isLoading}
        />
      </section>
    </TableProvider>
  );
};

export default MembersSettingsPage;
