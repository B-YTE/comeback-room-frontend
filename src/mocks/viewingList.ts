import aespaStage from '@/assets/viewing-list/aespa-stage.png';
import aespa from '@/assets/viewing-list/aespa.png';
import ateez from '@/assets/viewing-list/ateez.png';
import cortis from '@/assets/viewing-list/cortis.png';
import tws from '@/assets/viewing-list/tws.png';
import type { HistoryRoomDto } from '@/features/room/types/roomApi';

const thumbnails = [aespaStage, aespa, cortis, tws, ateez];
// Only LIVE / ENDED rooms can appear in watching histories.
export const viewingList: HistoryRoomDto[] = Array.from({ length: 23 }, (_, index) => ({
  roomId: index + 1,
  title: index < 5 ? '드디어 컴백한다는 그 날' : `컴백 함께 보기 ${index + 1}`,
  videoTitle: '[aespa] Whiplash Stage 컴백 같이 봤어요.',
  videoThumbnailUrl: thumbnails[index % 5],
  videoDurationSeconds: 192,
  tags:
    index % 5 < 2
      ? ['에스파', '컴백무대']
      : [['코르티스'], ['투어스'], ['에이티즈']][(index % 5) - 2],
  status: index % 5 === 0 || index % 5 === 2 ? 'LIVE' : 'ENDED',
  startAt: '2026-09-23T15:20:00',
  isPublic: index % 5 !== 2,
}));
