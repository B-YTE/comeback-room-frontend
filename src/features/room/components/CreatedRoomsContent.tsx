import { useState } from 'react';

import { ArtistFilter } from '@/features/room/components/ArtistFilter';
import { useCreatedRooms } from '@/features/room/hooks/useCreatedRooms';
import { Button } from '@/shared/ui/Button';
import { Pagination } from '@/shared/ui/Pagination';
import { Playlist } from '@/shared/ui/Playlist';

const PAGE_SIZE = 5;
const DATE_FORMAT = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});
const TIME_FORMAT = new Intl.DateTimeFormat('ko-KR', {
  timeZone: 'Asia/Seoul',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

export const CreatedRoomsContent = () => {
  const { data: rooms = [], isPending, isError, refetch } = useCreatedRooms();
  const [selected, setSelected] = useState('전체');
  const [page, setPage] = useState(1);
  const filteredRooms =
    selected === '전체' ? rooms : rooms.filter((room) => room.tags.includes(selected));
  const pageCount = Math.ceil(filteredRooms.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(1, pageCount));
  const visibleRooms = filteredRooms.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="mt-17 mb-20 flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="typo-display-medium">내가 만든 시청방</h1>
        <p className="typo-heading-h4 text-label-neutral">
          함께했던 시청방의 순간을 다시 만나보세요.
        </p>
      </header>
      <ArtistFilter
        selected={selected}
        onSelect={(artist) => {
          setSelected(artist);
          setPage(1);
        }}
      />
      {isPending ? (
        <p role="status" className="py-16 typo-body-large">
          내가 만든 시청방을 불러오는 중입니다.
        </p>
      ) : isError ? (
        <div role="alert" className="flex flex-col items-start gap-6 py-16 typo-body-large">
          <p>내가 만든 시청방을 불러오지 못했습니다.</p>
          <Button className="w-auto" onClick={() => void refetch()}>
            다시 시도
          </Button>
        </div>
      ) : filteredRooms.length === 0 ? (
        <p role="status" className="py-16 text-center typo-heading-h4 text-label-neutral">
          {selected === '전체'
            ? '아직 만든 시청방이 없습니다.'
            : `${selected} 태그로 만든 시청방이 없습니다.`}
        </p>
      ) : (
        <>
          <ul aria-label="내가 만든 시청방" className="flex flex-col gap-8">
            {visibleRooms.map(({ id, startsAt, ...room }) => (
              <li key={id}>
                <Playlist
                  {...room}
                  dateTime={startsAt}
                  date={DATE_FORMAT.format(new Date(startsAt)).replace(/\.$/, '')}
                  time={TIME_FORMAT.format(new Date(startsAt))}
                />
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </>
      )}
      <p className="typo-body-medium text-label-assistive">
        {import.meta.env.DEV ? '개발용 예시 목록입니다. ' : ''}실제 생성한 시청방 조회와 시청방 이동
        기능은 서버 연동 후 제공됩니다.
      </p>
    </div>
  );
};
