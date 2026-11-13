import { pendingApi } from '@/shared/api/pendingApi';
import { mapHistoryRoom } from '@/features/room/api/roomMapping';
import type { HistoryRoomDto, RoomPageDto } from '@/features/room/types/roomApi';
import type { ViewingListPage } from '@/features/room/types/viewingList';

// GET /api/v1/members/me/watching-histories — awaiting backend implementation.
export const getViewingList = async (
  artist: string,
  page: number,
  signal: AbortSignal,
): Promise<ViewingListPage> => {
  const data = await pendingApi<RoomPageDto<HistoryRoomDto>>('viewing-list', {
    params: { tags: artist === '전체' ? undefined : artist, page, size: 5 },
    signal,
  });
  return { items: data.rooms.map(mapHistoryRoom), nextPage: data.hasNext ? data.page + 1 : null };
};
