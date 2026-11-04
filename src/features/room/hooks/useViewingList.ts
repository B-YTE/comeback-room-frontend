import { useQuery } from '@tanstack/react-query';

import { getViewingList } from '@/features/room/api/viewingList';

export const useViewingList = () =>
  useQuery({
    queryKey: ['viewing-list', 'preview'],
    queryFn: ({ signal }) => getViewingList(signal),
    retry: false,
  });
