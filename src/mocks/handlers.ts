import { delay, http, HttpResponse } from 'msw';
import { createdRooms } from '@/mocks/createdRooms';
import { viewingList } from '@/mocks/viewingList';
import type { CreatedRoomDto, HistoryRoomDto, RoomDetailDto } from '@/features/room/types/roomApi';
import type { ApiErrorResponse, ApiResponse } from '@/types/api';

// Mutable state is confined to MSW; no mock mutation reaches the backend.
const rooms = [...createdRooms];
const subscribedIds = new Set([105]);
let nickname = '컴백룸';
const success = <T>(data: T, code: string, message: string, status = 200): Response =>
  HttpResponse.json<ApiResponse<T>>({ status, code, message, data }, { status });
const failure = (status: number, code: string, message: string, path: string): Response =>
  HttpResponse.json<ApiErrorResponse>(
    { status, code, message, path, timestamp: new Date().toISOString() },
    { status },
  );
const normalizeTag = (tag: string) => tag.replace(/\s/g, '').toUpperCase();
const listResponse = async <T extends HistoryRoomDto | CreatedRoomDto>(
  request: Request,
  items: T[],
  code: string,
  message: string,
  path: string,
) => {
  await delay(250);
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page') ?? 0);
  const size = Number(url.searchParams.get('size') ?? 5);
  const tags = url.searchParams.getAll('tags');
  if (
    !Number.isInteger(page) ||
    page < 0 ||
    !Number.isInteger(size) ||
    size < 1 ||
    size > 50 ||
    tags.length > 10
  ) {
    return failure(400, 'INVALID_INPUT_VALUE', '잘못된 입력값입니다.', path);
  }
  const filtered = items
    .filter((room) =>
      tags.every((tag) => room.tags.some((value) => normalizeTag(value) === normalizeTag(tag))),
    )
    .sort((a, b) => b.startAt.localeCompare(a.startAt) || b.roomId - a.roomId);
  const totalPages = Math.ceil(filtered.length / size);
  return success(
    {
      rooms: filtered.slice(page * size, (page + 1) * size),
      page,
      size,
      totalPages,
      hasNext: page + 1 < totalPages,
    },
    code,
    message,
  );
};
const findRoom = (id: number) =>
  rooms.find((room) => room.roomId === id) ?? viewingList.find((room) => room.roomId === id);
const detail = (room: HistoryRoomDto | CreatedRoomDto): RoomDetailDto => {
  const waiting = room.status === 'SCHEDULED' && room.roomId % 5 !== 1;
  const start = Date.parse(`${room.startAt}+09:00`);
  const kst = (time: number) => new Date(time + 9 * 60 * 60 * 1000).toISOString().slice(0, -1);
  const enterable = start - 30 * 60 * 1000;
  const end = start + room.videoDurationSeconds * 1000;
  const serverTime =
    room.status === 'SCHEDULED'
      ? enterable + (waiting ? -60000 : 60000)
      : room.status === 'LIVE'
        ? start + 20000
        : end + 60000;
  return {
    roomId: room.roomId,
    isPublic: room.isPublic,
    title: room.title,
    videoTitle: room.videoTitle,
    videoThumbnailUrl: room.videoThumbnailUrl,
    videoDurationSeconds: room.videoDurationSeconds,
    status: room.status,
    startAt: room.startAt,
    tags: room.tags,
    privateCode: 'privateCode' in room ? room.privateCode : null,
    serverTime: kst(serverTime),
    videoUrl: 'https://www.youtube.com/watch?v=mock',
    host: { memberId: 1, nickname },
    isHost: 'deletable' in room,
    endAt: kst(end),
    joinable: room.status !== 'ENDED' && !waiting,
    enterableAt: room.status === 'ENDED' ? null : kst(enterable),
    currentPositionSeconds: room.status === 'LIVE' ? 20 : null,
    currentParticipants: room.status === 'ENDED' ? null : room.roomId % 5 === 3 ? 100 : 1,
    totalParticipants: room.status === 'ENDED' ? 100 : null,
    maxParticipants: 100,
  };
};

export const handlers = [
  http.get('/__mocks__/profile', async () => {
    await delay(250);
    return success(
      { nickname, profileImageUrl: '' },
      'PROFILE_FOUND',
      '프로필 조회에 성공했습니다.',
    );
  }),
  http.patch('/__mocks__/profile/nickname', async ({ request }) => {
    const body: unknown = await request.json();
    if (
      !body ||
      typeof body !== 'object' ||
      !('nickname' in body) ||
      typeof body.nickname !== 'string' ||
      !/^[가-힣a-zA-Z0-9]{2,10}$/.test(body.nickname)
    ) {
      return failure(
        400,
        'INVALID_INPUT_VALUE',
        '잘못된 입력값입니다.',
        '/api/v1/profiles/me/nickname',
      );
    }
    await delay(250);
    nickname = body.nickname;
    return success({ nickname }, 'NICKNAME_UPDATED', '닉네임이 수정되었습니다.');
  }),
  http.get('/__mocks__/created-rooms', ({ request }) =>
    listResponse(
      request,
      rooms,
      'MY_WATCHING_ROOM_LIST_RETRIEVED',
      '내가 만든 시청방 목록을 성공적으로 조회했습니다.',
      '/api/v1/members/me/watching-rooms',
    ),
  ),
  http.get('/__mocks__/viewing-list', ({ request }) =>
    listResponse(
      request,
      viewingList,
      'WATCHING_HISTORY_LIST_RETRIEVED',
      '시청 기록을 성공적으로 조회했습니다.',
      '/api/v1/members/me/watching-histories',
    ),
  ),
  http.get('/__mocks__/rooms/:id', async ({ params }) => {
    await delay(250);
    const room = findRoom(Number(params.id));
    return room
      ? success(detail(room), 'WATCHING_ROOM_RETRIEVED', '시청방을 성공적으로 조회했습니다.')
      : failure(
          404,
          'ROOM_NOT_FOUND',
          '존재하지 않는 시청방입니다.',
          `/api/v1/watching-rooms/${params.id}`,
        );
  }),
  http.delete('/__mocks__/rooms/:id', async ({ params }) => {
    await delay(250);
    const index = rooms.findIndex((room) => room.roomId === Number(params.id));
    const path = `/api/v1/watching-rooms/${params.id}`;
    if (index < 0) return failure(404, 'ROOM_NOT_FOUND', '존재하지 않는 시청방입니다.', path);
    if (rooms[index].status !== 'SCHEDULED' || rooms[index].deletable !== true)
      return failure(409, 'ROOM_NOT_DELETABLE', '진행 전인 시청방만 삭제할 수 있습니다.', path);
    rooms.splice(index, 1);
    return success(null, 'WATCHING_ROOM_DELETED', '시청방이 성공적으로 삭제되었습니다.');
  }),
  http.get('/__mocks__/rooms/:id/notification-subscription', async ({ params }) => {
    const roomId = Number(params.id);
    await delay(250);
    if (!findRoom(roomId))
      return failure(
        404,
        'WATCHING_ROOM_NOT_FOUND',
        '존재하지 않는 시청방입니다.',
        `/api/v1/watching-rooms/${roomId}/notification-subscription`,
      );
    return success(
      { roomId, subscribed: subscribedIds.has(roomId) },
      'NOTIFICATION_SUBSCRIPTION_STATUS_RETRIEVED',
      '알림 신청 여부 조회에 성공했습니다.',
    );
  }),
  http.post('/__mocks__/rooms/:id/notification-subscription', async ({ params }) => {
    const roomId = Number(params.id);
    const path = `/api/v1/watching-rooms/${roomId}/notification-subscription`;
    await delay(250);
    const room = findRoom(roomId);
    if (!room) return failure(404, 'WATCHING_ROOM_NOT_FOUND', '존재하지 않는 시청방입니다.', path);
    if (subscribedIds.has(roomId))
      return failure(
        409,
        'NOTIFICATION_ALREADY_SUBSCRIBED',
        '이미 알림 신청한 시청방입니다.',
        path,
      );
    // The published spec repeats this code for an already started room.
    if (detail(room).joinable || room.status === 'ENDED')
      return failure(
        409,
        'NOTIFICATION_ALREADY_SUBSCRIBED',
        '이미 알림 신청한 시청방입니다.',
        path,
      );
    subscribedIds.add(roomId);
    return success(
      { roomId, subscribed: true },
      'NOTIFICATION_SUBSCRIBED',
      '시청방 알림을 신청했습니다.',
      201,
    );
  }),
  http.post('/__mocks__/rooms/:id/participants', async ({ params, request }) => {
    const roomId = Number(params.id);
    const path = `/api/v1/watching-rooms/${roomId}/participants`;
    const room = findRoom(roomId);
    const body: unknown = await request.json();
    await delay(250);
    if (!room) return failure(404, 'ROOM_NOT_FOUND', '존재하지 않는 시청방입니다.', path);
    const state = detail(room);
    if (!state.joinable)
      return failure(409, 'ROOM_NOT_JOINABLE', '지금은 입장할 수 없는 시청방입니다.', path);
    if ((state.currentParticipants ?? 0) >= state.maxParticipants)
      return failure(409, 'ROOM_FULL', '시청방 정원이 가득 찼습니다.', path);
    const code =
      body && typeof body === 'object' && 'privateCode' in body ? body.privateCode : null;
    const requiresCode =
      !room.isPublic && !state.isHost && !viewingList.some((history) => history.roomId === roomId);
    if (requiresCode && !code)
      return failure(403, 'PRIVATE_CODE_REQUIRED', '입장 코드가 필요한 시청방입니다.', path);
    if (code != null && (typeof code !== 'string' || !/^\d{4,10}$/.test(code)))
      return failure(400, 'INVALID_INPUT_VALUE', '잘못된 입력값입니다.', path);
    if (requiresCode && code !== state.privateCode)
      return failure(403, 'INVALID_PRIVATE_CODE', '입장 코드가 올바르지 않습니다.', path);
    return success(
      {
        roomId,
        status: room.status,
        serverTime: state.serverTime,
        ticket: 'mock-only-ticket',
        ticketExpiresInSeconds: 30,
      },
      'WATCHING_ROOM_JOINED',
      '시청방에 입장했습니다.',
    );
  }),
  // 인증: 개발 서버에 아직 없는 API만 목업 (2026-11-15 기준 login·refresh·logout은 실제 서버로 통과)
  // shortcut: 백엔드가 배포한 API는 여기서 지워 실제 서버로 보낼 것
  http.post('*/api/v1/auth/email/send', async () => {
    await delay(250);
    return success(null, 'EMAIL_CODE_SENT', '인증코드가 이메일로 발송되었습니다.');
  }),
  // 목업 인증번호는 123456
  http.post('*/api/v1/auth/email/verify', async ({ request }) => {
    const body = (await request.json()) as { verificationCode?: string };
    await delay(250);
    if (body.verificationCode !== '123456') {
      return failure(
        400,
        'INVALID_VERIFICATION_CODE',
        '인증코드가 일치하지 않거나 만료되었습니다.',
        '/api/v1/auth/email/verify',
      );
    }
    return success(
      { verificationToken: 'mock-verification-token' },
      'EMAIL_VERIFIED',
      '이메일 인증이 완료되었습니다.',
    );
  }),
  // 프로필 목업의 현재 닉네임만 사용 중으로 본다
  http.get('*/api/v1/auth/nickname/availability', async ({ request }) => {
    await delay(250);
    return success(
      { available: new URL(request.url).searchParams.get('nickname') !== nickname },
      'NICKNAME_AVAILABILITY_FOUND',
      '닉네임 사용 가능 여부를 조회했습니다.',
    );
  }),
  http.post('*/api/v1/auth/sign-up', async ({ request }) => {
    const body = (await request.json()) as { email: string; nickname: string };
    await delay(250);
    return success(
      { memberId: 1, email: body.email, nickname: body.nickname },
      'MEMBER_CREATED',
      '회원가입이 완료되었습니다.',
      201,
    );
  }),
  http.post('*/api/v1/auth/find-id', async () => {
    await delay(250);
    return success({ loginId: 'zin***' }, 'LOGIN_ID_FOUND', '아이디 조회에 성공했습니다.');
  }),
  http.post('*/api/v1/auth/password/reset-request', async () => {
    await delay(250);
    return success(
      null,
      'PASSWORD_RESET_REQUESTED',
      '비밀번호 재설정을 위한 인증코드가 발송되었습니다.',
    );
  }),
  http.post('*/api/v1/auth/password/reset', async () => {
    await delay(250);
    return success(null, 'PASSWORD_RESET_SUCCESS', '비밀번호가 재설정되었습니다.');
  }),
  http.get('/api/health', () => HttpResponse.json({ success: true, message: 'MSW is working' })),
];
