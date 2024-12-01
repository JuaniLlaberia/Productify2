import { usePaginatedQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

const BATCH_SIZE = 20;

type useGetThreadsProps = {
  teamId: Id<'teams'>;
  channelId?: Id<'channels'>;
  conversationId?: Id<'conversations'>;
  parentMessageId?: Id<'messages'>;
  threadsOnly?: boolean;
};

export type GetThreadsReturnType =
  (typeof api.messages.getMessages._returnType)['page'];

export const useGetThreads = ({ teamId, threadsOnly }: useGetThreadsProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.messages.getThreads,
    { teamId, threadsOnly },
    { initialNumItems: BATCH_SIZE }
  );

  return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
};
