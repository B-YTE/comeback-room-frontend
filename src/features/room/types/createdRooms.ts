// 시청 이력과 별개인 생성 시청방의 화면용 모델. 실제 API 명세가 아니다.
export interface CreatedRoom {
  id: string;
  title: string;
  subtitle: string;
  thumbnail: string;
  duration: string;
  tags: string[];
  startsAt: string;
  status: 'live' | 'ended' | 'scheduled';
  showPrivateRoom?: boolean;
}
