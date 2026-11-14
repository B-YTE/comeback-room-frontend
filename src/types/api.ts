// 노션 API 명세의 공통 응답 형식
export interface ApiResponse<T> {
  status: number;
  code: string;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  status: number;
  code: string;
  message: string;
  path: string;
  timestamp: string;
}
