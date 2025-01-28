'use client';

import { Database, Plus } from 'lucide-react';

import ChatHeader from '../../(components)/ChatHeader';
import SearchbarFilter from '../../../projects/[projectId]/(components)/SearchbarFilter';
import ChannelForm from './ChannelForm';
import {
  ColumnVisibilityDropdown,
  TableProvider,
} from '@/components/TableContext';
import { api } from '../../../../../../../convex/_generated/api';
import { Id } from '../../../../../../../convex/_generated/dataModel';
import { DataTable } from '@/components/ui/data-table';
import { channelColumns } from './ChannelsColumns';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useStablePaginatedQuery } from '@/hooks/useStablePaginatedQuery';
import { INITIAL_NUM_ITEMS } from '@/lib/consts';

type ChannelsListProps = {
  teamId: Id<'teams'>;
};

const ChannelsList = ({ teamId }: ChannelsListProps) => {
  const {
    results,
    isLoading,
    status: queryStatus,
    loadMore,
  } = useStablePaginatedQuery(
    api.channels.getAllChannels,
    { teamId },
    { initialNumItems: INITIAL_NUM_ITEMS }
  );

  return (
    <TableProvider>
      <ChatHeader
        chatName='Channels'
        chatIcon={<Database className='size-4' strokeWidth={1.5} />}
        menu={
          <div className='flex items-center space-x-2'>
            <ColumnVisibilityDropdown />
            <SearchbarFilter field='name' />
            <Separator orientation='vertical' />
            <ChannelForm
              trigger={
                <Button size='sm'>
                  <Plus className='size-4 mr-1.5' strokeWidth={1.5} /> New
                  Channel
                </Button>
              }
            />
          </div>
        }
      />

      <DataTable
        columns={channelColumns}
        data={results}
        isLoading={isLoading}
        paginationOpts={{
          canLoadMore: queryStatus === 'CanLoadMore',
          isLoadingMore: queryStatus === 'LoadingMore',
          loadMore: () => loadMore(INITIAL_NUM_ITEMS),
        }}
      />
    </TableProvider>
  );
};

export default ChannelsList;
