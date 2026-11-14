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

// 화면용 무한 스크롤 모델. nextPage은 API의 다음 0-based page 번호다.
export interface ViewingListPage {
  items: ViewingRoom[];
  nextPage: number | null;
}
