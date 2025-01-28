'use client';

import { Users } from 'lucide-react';

import SettingsHeader from '../(components)/SettingsHeader';
import { DataTable } from '@/components/ui/data-table';
import { membersColumns } from './(components)/membersColumns';
import { api } from '../../../../../../convex/_generated/api';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { TableProvider } from '@/components/TableContext';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { INITIAL_NUM_ITEMS } from '@/lib/consts';

const MembersSettingsPage = ({
  params: { teamId },
}: {
  params: { teamId: Id<'teams'> };
}) => {
  const {
    results,
    isLoading,
    status: queryStatus,
    loadMore,
  } = useStablePaginatedQuery(
    api.teams.getTeamMembers,
    { teamId },
    { initialNumItems: INITIAL_NUM_ITEMS }
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
          paginationOpts={{
            canLoadMore: queryStatus === 'CanLoadMore',
            isLoadingMore: queryStatus === 'LoadingMore',
            loadMore: () => loadMore(INITIAL_NUM_ITEMS),
          }}
        />
      </section>
    </TableProvider>
  );
};

export default MembersSettingsPage;
