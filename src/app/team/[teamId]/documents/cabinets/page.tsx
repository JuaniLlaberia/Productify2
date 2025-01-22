'use client';

import { Folders, Plus } from 'lucide-react';

import SearchbarFilter from '../../projects/[projectId]/(components)/SearchbarFilter';
import CabinetForm from '../(components)/CabinetForm';
import Header from '@/components/Header';
import {
  ColumnVisibilityDropdown,
  TableProvider,
} from '@/components/TableContext';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { DataTable } from '@/components/ui/data-table';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { INITIAL_NUM_ITEMS } from '@/lib/consts';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { api } from '../../../../../../convex/_generated/api';
import { cabinetsColumns } from './(components)/cabinetsColumns';

const CabinetsPage = ({
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
    api.cabinets.getAllCabinets,
    { teamId },
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  return (
    <TableProvider>
      <Header
        leftContent={
          <>
            <Folders className='size-4' strokeWidth={1.5} />

            <h1 className='text-sm font-medium'>Cabinets</h1>
          </>
        }
        rightContent={
          <>
            <ColumnVisibilityDropdown />
            <SearchbarFilter field='name' />
            <Separator orientation='vertical' />
            <CabinetForm
              trigger={
                <Button size='sm'>
                  <Plus className='size-4 mr-1.5' strokeWidth={1.5} /> New
                  cabinet
                </Button>
              }
            />
          </>
        }
      />
      <DataTable
        data={results}
        isLoading={isLoading}
        columns={cabinetsColumns}
        paginationOpts={{
          canLoadMore: queryStatus === 'CanLoadMore',
          isLoadingMore: queryStatus === 'LoadingMore',
          loadMore: () => loadMore(INITIAL_NUM_ITEMS),
        }}
      />
    </TableProvider>
  );
};

export default CabinetsPage;
