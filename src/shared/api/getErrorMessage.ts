import { isAxiosError } from 'axios';

// 에러 응답 본문의 message를 그대로 보여 주고, 없으면(네트워크 오류 등) 기본 문구를 쓴다
export const getErrorMessage = (error: unknown) => {
  if (isAxiosError<{ message?: string }>(error) && error.response?.data?.message) {
    return error.response.data.message;
  }
  return '요청에 실패했습니다. 잠시 후 다시 시도해주세요.';
};
