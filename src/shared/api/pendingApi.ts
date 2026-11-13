import axios, { type AxiosRequestConfig } from 'axios';

import type { ApiResponse } from '@/types/api';

// Backend develop has no controllers for these APIs yet (2026-11-13).
// On implementation confirmation, replace the caller with api.request at its documented URI.
// Never silently fall back from a real API error to fixture data.
export const pendingApi = async <T>(path: string, config: AxiosRequestConfig = {}): Promise<T> => {
  if (!import.meta.env.DEV) {
    throw new Error('아직 서버에서 지원하지 않는 기능입니다.');
  }
  const { data } = await axios.request<ApiResponse<T>>({
    ...config,
    url: `/__mocks__/${path}`,
  });
  return data.data;
};
