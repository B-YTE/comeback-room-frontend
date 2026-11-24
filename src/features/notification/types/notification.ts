export interface Notification {
  id: number;
  title: string;
  /** 첫째 줄, 시청방 안내 (예: [같이 달려요] 라이브가 10분 후 시작됩니다.) */
  message: string;
  /** 둘째 줄, 영상 제목. 한 줄을 넘으면 말줄임 */
  videoTitle: string;
  thumbnailUrl: string;
  /** ISO 8601 */
  createdAt: string;
  isRead: boolean;
  /** 시청하러 가기 대상 방. 없으면 링크를 숨긴다. */
  roomId?: number;
}
