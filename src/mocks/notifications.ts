import aespa from '@/assets/viewing-list/aespa.png';
import cortis from '@/assets/viewing-list/cortis.png';
import tws from '@/assets/viewing-list/tws.png';
import type { Notification } from '@/features/notification/types/notification';

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
const VIDEO_TITLE = '[ae:scenes] 사진을 부르는 비주얼 | 에스파 지젤 직캠 (aespa GISELLE FanCam)';

// shortcut: 알림 API 명세 전 화면 확인용 데이터, API 확정 시 MSW 핸들러로 옮긴다.
export const notifications: Notification[] = [
  {
    id: 1,
    title: '대기방이 생성되었습니다.',
    message: '[같이 달려요] 라이브가 10분 후 시작됩니다.',
    videoTitle: VIDEO_TITLE,
    thumbnailUrl: aespa,
    createdAt: minutesAgo(2),
    isRead: false,
    roomId: 1,
  },
  {
    id: 2,
    title: '시청방이 삭제되었습니다.',
    message: '[같이 달려요] 라이브가 삭제되었습니다.',
    videoTitle: VIDEO_TITLE,
    thumbnailUrl: cortis,
    createdAt: minutesAgo(27),
    isRead: false,
    roomId: 2,
  },
  {
    id: 3,
    title: '라이브가 시작되었습니다',
    message: '[같이 달려요] 라이브가 시작되었습니다',
    videoTitle: VIDEO_TITLE,
    thumbnailUrl: tws,
    createdAt: minutesAgo(60 * 24),
    isRead: true,
    roomId: 3,
  },
];
