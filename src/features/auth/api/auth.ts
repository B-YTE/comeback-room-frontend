import { api } from '@/shared/api/axios';
import type { ApiResponse } from '@/types/api';

export type EmailPurpose = 'SIGN_UP' | 'FIND_ID' | 'PASSWORD_RESET';

export const login = async (body: { loginId: string; password: string }) => {
  const { data } = await api.post<ApiResponse<{ accessToken: string }>>('/api/v1/auth/login', body);
  return data.data;
};

export const sendEmailCode = (body: { email: string; purpose: EmailPurpose }) =>
  api.post<ApiResponse<null>>('/api/v1/auth/email/send', body);

export const verifyEmailCode = async (body: {
  email: string;
  verificationCode: string;
  purpose: EmailPurpose;
}) => {
  const { data } = await api.post<ApiResponse<{ verificationToken: string }>>(
    '/api/v1/auth/email/verify',
    body,
  );
  return data.data;
};

export const checkNicknameAvailability = async (nickname: string) => {
  const { data } = await api.get<ApiResponse<{ available: boolean }>>(
    '/api/v1/auth/nickname/availability',
    { params: { nickname } },
  );
  return data.data;
};

export const findId = async (body: { email: string; verificationToken: string }) => {
  const { data } = await api.post<ApiResponse<{ loginId: string }>>('/api/v1/auth/find-id', body);
  return data.data;
};

export const requestPasswordReset = (body: { loginId: string; email: string }) =>
  api.post<ApiResponse<null>>('/api/v1/auth/password/reset-request', body);

export const resetPassword = (body: {
  verificationToken: string;
  newPassword: string;
  newPasswordConfirm: string;
}) => api.post<ApiResponse<null>>('/api/v1/auth/password/reset', body);
