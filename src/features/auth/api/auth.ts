import { api } from '@/shared/api/axios';
import type { ApiResponse } from '@/types/api';

export type EmailPurpose = 'SIGN_UP' | 'FIND_ID' | 'PASSWORD_RESET';

export const login = async (body: { loginId: string; password: string }) => {
  const { data } = await api.post<ApiResponse<{ accessToken: string }>>('/api/v1/auth/login', body);
  return data.data;
};

// Refresh Token 쿠키만으로 새 Access Token을 받는다. 서버가 응답하지 않아도 앱이 멈추지 않게 timeout을 둔다.
export const refreshAccessToken = async () => {
  const { data } = await api.post<ApiResponse<{ accessToken: string }>>(
    '/api/v1/auth/refresh',
    undefined,
    { timeout: 5000 },
  );
  return data.data.accessToken;
};

export const signUp = (body: {
  loginId: string;
  email: string;
  emailVerificationToken: string;
  nickname: string;
  password: string;
  passwordConfirm: string;
  termsAgreed: boolean;
  privacyAgreed: boolean;
}) =>
  api.post<ApiResponse<{ memberId: number; email: string; nickname: string }>>(
    '/api/v1/auth/sign-up',
    body,
  );

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
