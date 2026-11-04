export interface ViewingRoom {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  tags: string[];
  viewedAt: string;
  status: 'live' | 'ended' | 'scheduled';
  isPrivate: boolean;
}
