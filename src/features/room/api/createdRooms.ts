import { pendingApi } from '@/shared/api/pendingApi';
import { mapCreatedRoom } from '@/features/room/api/roomMapping';
import type { CreatedRoomDto, RoomPageDto } from '@/features/room/types/roomApi';

// GET /api/v1/members/me/watching-rooms — awaiting backend implementation.
export const getCreatedRooms = async (artist: string, page: number, signal: AbortSignal) => {
  const data = await pendingApi<RoomPageDto<CreatedRoomDto>>('created-rooms', {
    params: { tags: artist === '전체' ? undefined : artist, page, size: 5 },
    signal,
  });
  return { ...data, rooms: data.rooms.map(mapCreatedRoom) };
};

// DELETE /api/v1/watching-rooms/{roomId}; never used for removing history items.
export const deleteCreatedRoom = (roomId: string) =>
  pendingApi<null>(`rooms/${roomId}`, { method: 'DELETE' });
