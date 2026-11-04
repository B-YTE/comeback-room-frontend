import aespaStage from '@/assets/viewing-list/aespa-stage.png';
import aespa from '@/assets/viewing-list/aespa.png';
import ateez from '@/assets/viewing-list/ateez.png';
import cortis from '@/assets/viewing-list/cortis.png';
import tws from '@/assets/viewing-list/tws.png';
import type { ViewingRoom } from '@/features/room/types/viewingList';

// Figma의 예시 콘텐츠. 실제 사용자 시청 기록이 아니다.
export const viewingList: ViewingRoom[] = [
  { thumbnail: aespaStage, tags: ['에스파', '컴백무대'], status: 'live' },
  { thumbnail: aespa, tags: ['에스파', '컴백무대'], status: 'ended' },
  { thumbnail: cortis, tags: ['코르티스', '안무영상'], status: 'scheduled' },
  { thumbnail: tws, tags: ['투어스', '컴백무대'], status: 'ended' },
  { thumbnail: ateez, tags: ['에이티즈', '컴백무대'], status: 'ended' },
].map((room, index) => ({
  ...room,
  status: room.status as ViewingRoom['status'],
  id: `preview-${index + 1}`,
  title: '드디어 컴백한다는 그 날',
  description: '[aespa] Whiplash Stage 컴백 같이 봤어요.',
  duration: '3:12',
  viewedAt: '2026-09-23T15:20:00+09:00',
  isPrivate: index === 2,
}));
