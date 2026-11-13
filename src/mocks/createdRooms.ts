import type { CreatedRoomDto } from '@/features/room/types/roomApi';
import { viewingList } from '@/mocks/viewingList';

export const createdRooms: CreatedRoomDto[] = Array.from({ length: 25 }, (_, index) => {
  const room = viewingList[index % viewingList.length];
  const status = index % 5 === 2 ? 'LIVE' : index % 5 === 3 ? 'ENDED' : 'SCHEDULED';
  const isPublic = index % 5 !== 0;
  return {
    ...room,
    roomId: 101 + index,
    title: index < 5 ? '드디어 컴백한다는 그 날' : `함께 보는 컴백 예시 ${index + 1}`,
    status,
    isPublic,
    privateCode: isPublic ? null : '0000',
    deletable: status === 'SCHEDULED',
    startAt: status === 'SCHEDULED' ? '2026-11-23T15:50:00' : room.startAt,
  };
});
