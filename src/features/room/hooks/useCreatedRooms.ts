import { useQuery } from '@tanstack/react-query';
import { getCreatedRooms } from '@/features/room/api/createdRooms';

export const useCreatedRooms = (artist: string, page: number) =>
  useQuery({
    queryKey: ['created-rooms', artist, page],
    queryFn: ({ signal }) => getCreatedRooms(artist, page, signal),
    retry: false,
  });
