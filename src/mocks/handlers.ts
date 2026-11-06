import { delay, http, HttpResponse } from 'msw';

import { createdRooms } from '@/mocks/createdRooms';
import { viewingList } from '@/mocks/viewingList';

export const handlers = [
  http.get('/__mocks__/created-rooms', async () => {
    await delay(400);
    return HttpResponse.json(createdRooms);
  }),
  http.get('/__mocks__/viewing-list', async () => {
    await delay(400);
    return HttpResponse.json(viewingList);
  }),
  http.get('/api/health', () => {
    return HttpResponse.json({
      success: true,
      message: 'MSW is working',
    });
  }),
];
