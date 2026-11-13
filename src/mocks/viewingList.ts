import aespaStage from '@/assets/viewing-list/aespa-stage.png';
import aespa from '@/assets/viewing-list/aespa.png';
import ateez from '@/assets/viewing-list/ateez.png';
import cortis from '@/assets/viewing-list/cortis.png';
import tws from '@/assets/viewing-list/tws.png';
import type { RoomEntry } from '@/features/room/types/roomEntry';
import type { ViewingRoom } from '@/features/room/types/viewingList';

// Figma의 예시 콘텐츠. 실제 사용자 시청 기록이 아니다.
const EXAMPLES = [
  { thumbnail: aespaStage, tags: ['에스파', '컴백무대'], status: 'live' },
  { thumbnail: aespa, tags: ['에스파', '컴백무대'], status: 'ended' },
  { thumbnail: cortis, tags: ['코르티스', '안무영상'], status: 'scheduled' },
  { thumbnail: tws, tags: ['투어스', '컴백무대'], status: 'ended' },
  { thumbnail: ateez, tags: ['에이티즈', '컴백무대'], status: 'ended' },
] satisfies Pick<ViewingRoom, 'thumbnail' | 'tags' | 'status'>[];

const ENTRY_EXAMPLES = [
  { kind: 'not-open', opensAt: '2026-11-23T15:20:00+09:00', subscribed: false },
  { kind: 'not-open', opensAt: '2026-11-23T15:20:00+09:00', subscribed: true },
  { kind: 'code-required' },
  { kind: 'full' },
  { kind: 'available' },
] satisfies RoomEntry[];

// 23개의 서로 다른 예시 이력으로 페이지 경계와 마지막 페이지를 검증한다.
export const viewingList: ViewingRoom[] = Array.from({ length: 23 }, (_, index) => ({
  ...EXAMPLES[index % EXAMPLES.length],
  entry: ENTRY_EXAMPLES[index % ENTRY_EXAMPLES.length],
  id: `preview-${index + 1}`,
  title: index < 5 ? '드디어 컴백한다는 그 날' : `컴백 함께 보기 ${index + 1}`,
  description: '[aespa] Whiplash Stage 컴백 같이 봤어요.',
  duration: '3:12',
  viewedAt: '2026-09-23T15:20:00+09:00',
  isPrivate: index % 5 === 2,
  entryCode: index === 2 ? '0000' : undefined,
}));
