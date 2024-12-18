'use client';

import { HardDrive, Plus } from 'lucide-react';

import Header from '@/components/Header';
import SearchbarFilter from '../projects/[projectId]/(components)/SearchbarFilter';
import StorageForm from './(components)/StorageForm';
import {
  ColumnVisibilityDropdown,
  TableProvider,
} from '@/components/TableContext';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { api } from '../../../../../convex/_generated/api';
import { Id } from '../../../../../convex/_generated/dataModel';
import { DataTable } from '@/components/ui/data-table';
import { storagesColumns } from './(components)/storagesColumns';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { INITIAL_NUM_ITEMS } from '@/lib/consts';

const AssetsPage = ({
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
    api.storages.getAllStorages,
    { teamId },
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  return (
    <TableProvider>
      <Header
        leftContent={
          <>
            <HardDrive className='size-4' strokeWidth={1.5} />

            <h1 className='text-sm font-medium'>Storages</h1>
          </>
        }
        rightContent={
          <>
            <ColumnVisibilityDropdown />
            <SearchbarFilter field='name' />
            <Separator orientation='vertical' />
            <StorageForm
              trigger={
                <Button size='sm'>
                  <Plus className='size-4 mr-1.5' strokeWidth={1.5} /> New
                  Storage
                </Button>
              }
            />
          </>
        }
      />
      <DataTable
        data={results}
        isLoading={isLoading}
        columns={storagesColumns}
        paginationOpts={{
          canLoadMore: queryStatus === 'CanLoadMore',
          loadMore: () => loadMore(INITIAL_NUM_ITEMS),
        }}
      />
      <div className='bg-muted/20 p-1 px-4 border-b flex items-center'>
        <p className='text-sm text-muted-foreground'>Total: {results.length}</p>
      </div>
    </TableProvider>
  );
};

export default AssetsPage;
