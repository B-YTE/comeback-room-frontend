import { pendingApi } from '@/shared/api/pendingApi';
import type {
  JoinRoomDto,
  JoinRoomRequest,
  RoomDetailDto,
  SubscriptionDto,
} from '@/features/room/types/roomApi';

// Correspond to /api/v1/watching-rooms/{roomId}[/{suffix}].
export const getRoomDetail = (id: string) => pendingApi<RoomDetailDto>(`rooms/${id}`);
export const getSubscription = (id: string) =>
  pendingApi<SubscriptionDto>(`rooms/${id}/notification-subscription`);
export const subscribeRoom = (id: string) =>
  pendingApi<SubscriptionDto>(`rooms/${id}/notification-subscription`, { method: 'POST' });
export const joinPrivateRoom = (id: string, data: JoinRoomRequest) =>
  pendingApi<JoinRoomDto>(`rooms/${id}/participants`, { method: 'POST', data });
