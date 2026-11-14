import type { CreatedRoomDto, HistoryRoomDto } from '@/features/room/types/roomApi';

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

// The API's startAt has KST semantics even when its ISO string has no offset.
export const roomTime = (value: string) =>
  /(?:Z|[+-]\d{2}:\d{2})$/.test(value) ? value : `${value}+09:00`;

export const mapHistoryRoom = (room: HistoryRoomDto) => ({
  id: String(room.roomId),
  title: room.title,
  description: room.videoTitle,
  hasWatchingHistory: true,
  thumbnail: room.videoThumbnailUrl,
  duration: formatDuration(room.videoDurationSeconds),
  tags: room.tags,
  viewedAt: roomTime(room.startAt),
  status: room.status === 'LIVE' ? ('live' as const) : ('ended' as const),
  isPrivate: !room.isPublic,
});

export const mapCreatedRoom = (room: CreatedRoomDto) => ({
  id: String(room.roomId),
  title: room.title,
  subtitle: room.videoTitle,
  thumbnail: room.videoThumbnailUrl,
  duration: formatDuration(room.videoDurationSeconds),
  tags: room.tags,
  startsAt: roomTime(room.startAt),
  status: ({ LIVE: 'live', ENDED: 'ended', SCHEDULED: 'scheduled' } as const)[room.status],
  showPrivateRoom: !room.isPublic,
  entryCode: room.privateCode ?? undefined,
  deletable: room.deletable,
});
