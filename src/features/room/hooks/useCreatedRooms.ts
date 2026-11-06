import { useQuery } from '@tanstack/react-query';

import { getCreatedRooms } from '@/features/room/api/createdRooms';

export const useCreatedRooms = () =>
  useQuery({
    queryKey: ['created-rooms', 'preview'],
    queryFn: ({ signal }) => getCreatedRooms(signal),
    retry: false,
  });
