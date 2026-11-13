import { delay, http, HttpResponse } from 'msw';

import { createdRooms } from '@/mocks/createdRooms';
import { viewingList } from '@/mocks/viewingList';

export const handlers = [
  http.get('/__mocks__/created-rooms', async () => {
    await delay(400);
    return HttpResponse.json(createdRooms);
  }),
  http.get('/__mocks__/viewing-list', async ({ request }) => {
    await delay(400);
    // 이 페이지 규격은 UI 시연용이며 실제 목록 API와 무관하다.
    const url = new URL(request.url);
    const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);
    const artist = url.searchParams.get('artist') ?? '전체';
    const rooms =
      artist === '전체' ? viewingList : viewingList.filter((room) => room.tags.includes(artist));
    const items = rooms.slice(offset, offset + 5);
    return HttpResponse.json({ items, nextOffset: offset + 5 < rooms.length ? offset + 5 : null });
  }),
  http.get('/api/health', () => {
    return HttpResponse.json({
      success: true,
      message: 'MSW is working',
    });
  }),
];
