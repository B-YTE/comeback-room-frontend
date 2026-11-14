import { useEffect, useRef, useState } from 'react';

import { RoomEntryDialog } from '@/features/room/components/RoomEntryDialog';
import { useRoomEntry } from '@/features/room/hooks/useRoomEntry';
import { ArtistFilter } from '@/features/room/components/ArtistFilter';
import { ViewingRoomCard } from '@/features/room/components/ViewingRoomCard';
import { useViewingList } from '@/features/room/hooks/useViewingList';
import { Button } from '@/shared/ui/Button';

export const ViewingListContent = () => {
  const entry = useRoomEntry();
  const [selected, setSelected] = useState('전체');
  const {
    data,
    isPending,
    isError,
    isFetchNextPageError,
    isFetching,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useViewingList(selected);
  const allHistory = useViewingList('전체');
  const sentinel = useRef<HTMLDivElement>(null);
  const rooms = [
    ...new Map(data?.pages.flatMap((page) => page.items).map((room) => [room.id, room])).values(),
  ];
  // 예상 밖 상태는 변환하지 않고 제외하며 계약 불일치를 화면에 알린다.
  const hasInvalidStatus = rooms.some((room) => room.status !== 'live' && room.status !== 'ended');
  const visibleRooms = rooms.filter((room) => room.status === 'live' || room.status === 'ended');
  const isHistoryEmpty =
    allHistory.isSuccess &&
    !allHistory.isFetching &&
    allHistory.data.pages.every((page) => page.items.length === 0) &&
    !allHistory.hasNextPage;

  useEffect(() => {
    const element = sentinel.current;
    if (!element || !hasNextPage || isFetching || isError) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void fetchNextPage({ cancelRefetch: false });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, isError, fetchNextPage]);

  return (
    <div className="mt-17 mb-20 flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 tabIndex={-1} className="typo-display-medium">
          내 시청 목록
        </h1>
        <p className="typo-heading-h4 text-label-neutral">
          함께했던 시청방의 순간을 다시 만나보세요.
        </p>
      </header>
      <ArtistFilter selected={selected} onSelect={setSelected} />
      {visibleRooms.length > 0 && (
        <ul aria-label="내 시청 목록" className="flex flex-col gap-8">
          {visibleRooms.map((room) => (
            <ViewingRoomCard key={room.id} room={room} onOpen={() => entry.handleOpen(room)} />
          ))}
        </ul>
      )}
      {(isFetching || (visibleRooms.length === 0 && allHistory.isFetching)) && (
        <p role="status" className="py-16 typo-body-large text-label-neutral">
          시청 목록을 불러오는 중입니다.
        </p>
      )}
      {(isError || (visibleRooms.length === 0 && allHistory.isError)) && (
        <div role="alert" className="flex flex-col items-start gap-6 py-16">
          <p>시청 목록을 불러오지 못했습니다.</p>
          <Button
            onClick={() => {
              void (isFetchNextPageError ? fetchNextPage({ cancelRefetch: false }) : refetch());
              if (allHistory.isError) void allHistory.refetch();
            }}
            className="w-auto"
          >
            다시 시도
          </Button>
        </div>
      )}
      {!isPending &&
        !isFetching &&
        !isError &&
        allHistory.isSuccess &&
        !allHistory.isFetching &&
        !hasInvalidStatus &&
        visibleRooms.length === 0 &&
        !hasNextPage && (
          <p role="status" className="py-16 text-center typo-heading-h4 text-label-neutral">
            {isHistoryEmpty
              ? '아직 참여한 시청방이 없어요.'
              : `${selected}의 시청 목록이 없습니다.`}
          </p>
        )}
      <div ref={sentinel} aria-hidden="true" className="h-1" />
      {entry.isPending && !entry.dialog && <p role="status">시청방 정보를 확인하는 중입니다.</p>}
      {entry.error && !entry.dialog && <p role="alert">{entry.error}</p>}
      {entry.dialog && (
        <RoomEntryDialog
          state={entry.dialog}
          onClose={entry.handleClose}
          onSubscribe={entry.handleSubscribe}
          onEnter={entry.handleEnter}
          isPending={entry.isPending}
          error={entry.error}
        />
      )}
      {hasInvalidStatus && (
        <p role="alert" className="typo-body-medium text-label-neutral">
          시청 기록에 지원하지 않는 상태가 포함되어 있습니다. 목록을 다시 확인해주세요.
        </p>
      )}
      <p className="typo-body-medium text-label-assistive">
        {import.meta.env.DEV
          ? '개발용 예시 목록입니다.'
          : '시청 기록 조회는 서버 구현을 기다리고 있습니다.'}
      </p>
    </div>
  );
};
