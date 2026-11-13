import type { RoomEntryTarget } from '@/features/room/types/roomEntry';

// API DTO를 카드 표시 구조로 변환한 화면용 모델.
export interface CreatedRoom extends RoomEntryTarget {
  deletable: boolean;
  title: string;
  subtitle: string;
  thumbnail: string;
  duration: string;
  tags: string[];
  startsAt: string;
  status: 'live' | 'ended' | 'scheduled';
  showPrivateRoom?: boolean;
}
