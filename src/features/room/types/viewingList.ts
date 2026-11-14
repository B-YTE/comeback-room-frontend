import type { RoomEntryTarget } from '@/features/room/types/roomEntry';

export interface ViewingRoom extends RoomEntryTarget {
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  tags: string[];
  viewedAt: string;
  status: 'live' | 'ended';
  isPrivate: boolean;
}

// 개발용 MSW 전용 페이지 모델. 백엔드 API 계약이 아니다.
export interface ViewingListPage {
  items: ViewingRoom[];
  nextOffset: number | null;
}
