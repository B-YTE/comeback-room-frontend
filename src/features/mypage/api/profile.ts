import { pendingApi } from '@/shared/api/pendingApi';

export interface ProfileDto {
  nickname: string;
  profileImageUrl: string;
}
export interface UpdateNicknameRequest {
  nickname: string;
}

// GET /api/v1/profiles/me; PATCH /api/v1/profiles/me/nickname.
export const getProfile = (signal: AbortSignal) => pendingApi<ProfileDto>('profile', { signal });
export const updateNickname = (data: UpdateNicknameRequest) =>
  pendingApi<Pick<ProfileDto, 'nickname'>>('profile/nickname', { method: 'PATCH', data });
