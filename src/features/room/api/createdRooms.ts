import axios from 'axios';

import type { CreatedRoom } from '@/features/room/types/createdRooms';

// 개발용 MSW 전용 경로. 실제 API/인증 방식은 결정하지 않는다.
export const getCreatedRooms = async (signal: AbortSignal): Promise<CreatedRoom[]> => {
  if (!import.meta.env.DEV) return [];
  const { data } = await axios.get<CreatedRoom[]>('/__mocks__/created-rooms', { signal });
  return data;
};
