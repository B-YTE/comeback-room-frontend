import aespaStage from '@/assets/viewing-list/aespa-stage.png';
import aespa from '@/assets/viewing-list/aespa.png';
import ateez from '@/assets/viewing-list/ateez.png';
import cortis from '@/assets/viewing-list/cortis.png';
import tws from '@/assets/viewing-list/tws.png';
import type { CreatedRoom } from '@/features/room/types/createdRooms';

const EXAMPLES = [
  { thumbnail: aespaStage, tags: ['에스파', '컴백무대'], status: 'live', showPrivateRoom: true },
  { thumbnail: aespa, tags: ['에스파', '컴백무대'], status: 'scheduled' },
  { thumbnail: cortis, tags: ['코르티스', '안무영상'], status: 'ended' },
  { thumbnail: tws, tags: ['투어스', '컴백무대'], status: 'ended' },
  { thumbnail: ateez, tags: ['에이티즈', '컴백무대'], status: 'ended' },
] satisfies Partial<CreatedRoom>[];

// 실제 사용자 소유 정보와 무관한 테스트 데이터. 페이지 이동 시연을 위한 25개 예시.
export const createdRooms: CreatedRoom[] = Array.from({ length: 25 }, (_, index) => ({
  ...EXAMPLES[index % EXAMPLES.length],
  id: `created-preview-${index + 1}`,
  title: index < 5 ? '드디어 컴백한다는 그 날' : `함께 보는 컴백 예시 ${index + 1}`,
  subtitle: '[aespa] Whiplash Stage 컴백 같이 봤어요.',
  entryCode: index === 0 ? '0000' : undefined,
  duration: '3:12',
  startsAt: '2026-09-23T15:20:00+09:00',
}));
