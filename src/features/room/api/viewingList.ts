import axios from 'axios';

import type { ViewingRoom } from '@/features/room/types/viewingList';

// 개발용 MSW 전용 경로. 실제 API 명세가 확정되면 이 어댑터를 교체한다.
export const getViewingList = async (signal: AbortSignal): Promise<ViewingRoom[]> => {
  if (!import.meta.env.DEV) return [];
  const { data } = await axios.get<ViewingRoom[]>('/__mocks__/viewing-list', { signal });
  return data;
};
