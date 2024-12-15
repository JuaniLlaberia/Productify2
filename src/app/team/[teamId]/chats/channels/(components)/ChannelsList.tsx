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

type ChannelsListProps = {
  teamId: Id<'teams'>;
};

const ChannelsList = ({ teamId }: ChannelsListProps) => {
  const { results, isLoading } = useStablePaginatedQuery(
    api.channels.getAllChannels,
    { teamId },
    { initialNumItems: 10 }
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
      />
      <div className='bg-muted/20 p-1 px-4 border-b flex items-center'>
        <p className='text-sm text-muted-foreground'>Total: {results.length}</p>
      </div>
    </TableProvider>
  );
};

export default ChannelsList;
