import { useState } from 'react';

import {
  RoomFilterDialog,
  type RoomFilterOptions,
} from '@/features/room/components/RoomFilterDialog';

import { PrivateRoomEntryDialog } from '@/features/room/components/PrivateRoomEntryDialog';

import popular1 from '@/assets/home/popular-1.png';
import popular2 from '@/assets/home/popular-2.png';
import popular3 from '@/assets/home/popular-3.png';

import room1 from '@/assets/home/room-1.png';
import room2 from '@/assets/home/room-2.png';
import room3 from '@/assets/home/room-3.png';
import room4 from '@/assets/home/room-4.png';
import room5 from '@/assets/home/room-5.png';
import room6 from '@/assets/home/room-6.png';
import room7 from '@/assets/home/room-7.png';
import room8 from '@/assets/home/room-8.png';
import room9 from '@/assets/home/room-9.png';

import filterIcon from '@/assets/home/filter.svg';

type RoomStatus = 'live' | 'scheduled';
type RoomFilter = 'all' | RoomStatus;

type Video = {
  id: number;
  title: string;
  artist: string;
  thumbnail: string;
};

type ViewingRoom = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  status: RoomStatus;
  startTime?: string;
  viewers: number;
  capacity: number;
};

const popularVideos: Video[] = [
  {
    id: 1,
    title: '같이 봐요',
    artist: 'aespa',
    thumbnail: popular1,
  },
  {
    id: 2,
    title: '같이 봐요',
    artist: 'aespa',
    thumbnail: popular2,
  },
  {
    id: 3,
    title: '같이 봐요',
    artist: 'aespa',
    thumbnail: popular3,
  },
];

const roomImages = [room1, room2, room3, room4, room5, room6, room7, room8, room9];

const viewingRooms: ViewingRoom[] = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  title: '오늘도 에스파랑 같이 봐요 💗',
  description: 'aespa · Supernova MV 함께 보기',
  thumbnail: roomImages[index],
  status: index === 2 || index === 5 || index === 8 ? 'scheduled' : 'live',
  startTime: '19:30',
  viewers: 291,
  capacity: 300,
}));

function PopularVideoCard({ video }: { video: Video }) {
  return (
    <article className="min-w-0">
      <div className="aspect-video overflow-hidden rounded-medium bg-background-subtle">
        <img
          src={video.thumbnail}
          alt={`${video.artist} 영상`}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex items-center gap-3 pt-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-engagement-solid typo-label-medium text-static-white">
          ae
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <strong className="typo-label-large text-label-strong">{video.title}</strong>
            <span className="typo-caption text-label-assistive">방장</span>
            <span className="typo-caption text-label-neutral">방장 이름</span>
          </div>

          <p className="mt-1 truncate typo-caption text-label-assistive">
            {video.artist} · [ae:scenes] 사진을 부르는 비주얼
          </p>
        </div>
      </div>
    </article>
  );
}

function ViewingRoomCard({ room }: { room: ViewingRoom }) {
  return (
    <article className="min-w-0 overflow-hidden rounded-medium border border-line-subtle bg-background-surface">
      <div className="aspect-[585/300] overflow-hidden bg-background-subtle">
        <img src={room.thumbnail} alt={room.title} className="h-full w-full object-cover" />
      </div>

      {/* 영상 진행 바 */}
      <div className="h-[3px] w-full bg-[#555560]">
        <div className="h-full w-[60%] bg-[#FF2F78]" />
      </div>

      <div className="p-4">
        <h3 className="truncate typo-title-20-semibold text-label-strong">{room.title}</h3>

        <p className="mt-2 truncate typo-caption text-label-assistive">{room.description}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent-engagement-solid typo-caption text-static-white">
              MY
            </span>
            <span className="truncate typo-caption text-label-neutral">MY의 작은 방</span>
          </div>

          <span className="shrink-0 typo-caption text-label-assistive">
            ♧ {room.viewers}/{room.capacity}
          </span>
        </div>
      </div>
    </article>
  );
}

export const MainPage = () => {
  const [filter, setFilter] = useState<RoomFilter>('all');

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isPrivateRoomOpen, setIsPrivateRoomOpen] = useState(false);

  const [roomFilters, setRoomFilters] = useState<RoomFilterOptions>({
    sort: 'latest',
    visibility: 'all',
  });

  const filteredRooms = viewingRooms.filter((room) => {
    if (filter === 'all') return true;
    return room.status === filter;
  });

  const filters: { label: string; value: RoomFilter }[] = [
    { label: '전체', value: 'all' },
    { label: '진행 중', value: 'live' },
    { label: '진행 예정', value: 'scheduled' },
  ];

  return (
    <main className="w-full pt-12 pb-24">
      {/* 메인 소개 */}
      <section className="mb-12 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="typo-heading-h1 text-label-strong">좋아하는 순간, 함께 봐요.</h1>
          <p className="mt-2 typo-body-large text-label-neutral">
            같은 영상을 보고, 같은 마음으로 이야기하는 우리들의 방
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-accent-live-solid" />
          <span className="typo-caption text-label-neutral">지금 함께하는 팬 1,284명</span>
        </div>
      </section>

      {/* 인기 영상 */}
      <section className="mb-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="typo-heading-semibold-36 text-label-strong">
            이번 주 <span className="text-primary-normal">인기 영상</span>
          </h2>

          <button
            type="button"
            className="flex items-center gap-2 typo-label-medium text-label-neutral hover:text-label-strong"
          >
            전체 보기
            <span aria-hidden="true">›</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {popularVideos.map((video) => (
            <PopularVideoCard key={video.id} video={video} />
          ))}
        </div>
      </section>

      {/* 시청방 목록 */}
      <section>
        <h2 className="mb-6 typo-heading-semibold-36 text-label-strong">
          시청방 목록 <span className="ml-2 text-primary-normal">24</span>
        </h2>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={`rounded-full px-6 py-3.5 text-[16px] font-medium transition-colors ${
                  filter === item.value
                    ? 'bg-static-white text-static-black'
                    : 'bg-background-subtle text-label-neutral hover:bg-background-interactive'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center justify-center gap-2 rounded-full bg-background-subtle px-5 py-3 typo-label-medium text-label-neutral"
          >
            <img src={filterIcon} alt="" aria-hidden="true" className="h-6 w-6" />
            필터
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <ViewingRoomCard key={room.id} room={room} />
          ))}
        </div>

        {filteredRooms.length === 0 && (
          <p className="py-16 text-center typo-body-large text-label-assistive">
            해당하는 시청방이 없어요.
          </p>
        )}
      </section>

      {/* 시청방 필터 팝업 */}
      {isFilterOpen && (
        <RoomFilterDialog
          initialFilters={roomFilters}
          onClose={() => setIsFilterOpen(false)}
          onApply={(newFilters) => {
            setRoomFilters(newFilters);
            setIsFilterOpen(false);

            if (newFilters.visibility === 'private') {
              setIsPrivateRoomOpen(true);
            }
          }}
        />
      )}

      {/* 비공개방 입장 팝업 */}
      {isPrivateRoomOpen && (
        <PrivateRoomEntryDialog
          onClose={() => setIsPrivateRoomOpen(false)}
          onEnter={(code) => {
            console.log('입력한 코드:', code);
          }}
        />
      )}
    </main>
  );
};
