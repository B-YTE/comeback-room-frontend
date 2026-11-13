import { useInfiniteQuery } from '@tanstack/react-query';

import { getViewingList } from '@/features/room/api/viewingList';

export const useViewingList = (artist: string) =>
  useInfiniteQuery({
    queryKey: ['viewing-list', 'preview', artist],
    queryFn: ({ pageParam, signal }) => getViewingList(artist, pageParam, signal),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    gcTime: 0,
    retry: false,
  });
