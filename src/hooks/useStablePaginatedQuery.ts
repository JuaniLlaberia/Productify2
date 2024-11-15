import { useRef } from 'react';
import { usePaginatedQuery } from 'convex/react';

//Not fully reactive query fn => Ideal when filtering data
export const useStablePaginatedQuery = ((name, ...args) => {
  const result = usePaginatedQuery(name, ...args);
  const stored = useRef(result);

  if (result.status !== 'LoadingMore' && result.status !== 'LoadingFirstPage')
    stored.current = result;

  return stored.current;
}) as typeof usePaginatedQuery;
