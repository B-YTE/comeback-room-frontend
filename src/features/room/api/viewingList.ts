import axios from 'axios';

import type { ViewingListPage } from '@/features/room/types/viewingList';

// 개발용 MSW 전용 경로/페이지 규격. 실제 API 명세가 확정되면 교체한다.
export const getViewingList = async (
  artist: string,
  offset: number,
  signal: AbortSignal,
): Promise<ViewingListPage> => {
  if (!import.meta.env.DEV) return { items: [], nextOffset: null };
  const { data } = await axios.get<ViewingListPage>('/__mocks__/viewing-list', {
    params: { artist, offset },
    signal,
  });
  return data;
};
