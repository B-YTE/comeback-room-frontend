export type RoomStatus = 'SCHEDULED' | 'LIVE' | 'ENDED';

export interface HistoryRoomDto {
  roomId: number;
  isPublic: boolean;
  title: string;
  videoTitle: string;
  videoThumbnailUrl: string;
  videoDurationSeconds: number;
  status: Exclude<RoomStatus, 'SCHEDULED'>;
  startAt: string;
  tags: string[];
}

export interface CreatedRoomDto extends Omit<HistoryRoomDto, 'status'> {
  status: RoomStatus;
  privateCode: string | null;
  deletable: boolean;
}

export interface RoomPageDto<T> {
  rooms: T[];
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
}

export interface RoomDetailDto extends Omit<CreatedRoomDto, 'deletable'> {
  serverTime: string;
  videoUrl: string;
  host: { memberId: number; nickname: string };
  isHost: boolean;
  endAt: string;
  joinable: boolean;
  enterableAt: string | null;
  currentPositionSeconds: number | null;
  currentParticipants: number | null;
  totalParticipants: number | null;
  maxParticipants: number;
}

export interface SubscriptionDto {
  roomId: number;
  subscribed: boolean;
}
export interface JoinRoomRequest {
  privateCode?: string | null;
}
export interface JoinRoomDto {
  roomId: number;
  status: Exclude<RoomStatus, 'ENDED'>;
  serverTime: string;
  ticket: string;
  ticketExpiresInSeconds: number;
}
