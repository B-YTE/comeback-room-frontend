import { useEffect, useRef, useState } from 'react';

import { ArtistFilter } from '@/features/room/components/ArtistFilter';
import { DeleteRoomDialog } from '@/features/room/components/DeleteRoomDialog';
import { ViewingRoomCard } from '@/features/room/components/ViewingRoomCard';
import { useViewingList } from '@/features/room/hooks/useViewingList';
import type { ViewingRoom } from '@/features/room/types/viewingList';
import { Button } from '@/shared/ui/Button';

export const ViewingListContent = () => {
  const [selected, setSelected] = useState('전체');
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<ViewingRoom | null>(null);
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
  const sentinel = useRef<HTMLDivElement>(null);
  const rooms = [
    ...new Map(data?.pages.flatMap((page) => page.items).map((room) => [room.id, room])).values(),
  ];
  const visibleRooms = rooms.filter((room) => !deletedIds.includes(room.id));

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
            <ViewingRoomCard key={room.id} room={room} onDelete={() => setDeleting(room)} />
          ))}
        </ul>
      )}
      {isFetching && (
        <p role="status" className="py-16 typo-body-large text-label-neutral">
          시청 목록을 불러오는 중입니다.
        </p>
      )}
      {isError && (
        <div role="alert" className="flex flex-col items-start gap-6 py-16">
          <p>시청 목록을 불러오지 못했습니다.</p>
          <Button
            onClick={() =>
              void (isFetchNextPageError ? fetchNextPage({ cancelRefetch: false }) : refetch())
            }
            className="w-auto"
          >
            다시 시도
          </Button>
        </div>
      )}
      {!isPending && !isError && visibleRooms.length === 0 && (
        <p role="status" className="py-16 text-center typo-heading-h4 text-label-neutral">
          {selected === '전체'
            ? '아직 시청 목록이 없습니다.'
            : `${selected}의 시청 목록이 없습니다.`}
        </p>
      )}
      <div ref={sentinel} aria-hidden="true" className="h-1" />
      {deleting && (
        <DeleteRoomDialog
          title={deleting.title}
          onClose={() => setDeleting(null)}
          onConfirm={() => {
            setDeletedIds((ids) => [...ids, deleting.id]);
            setDeleting(null);
          }}
        />
      )}
      <p className="typo-body-medium text-label-assistive">
        {import.meta.env.DEV ? '개발용 예시 목록입니다. ' : ''}실제 시청 목록과 시청방 이동 기능은
        서버 연동 후 제공됩니다.
      </p>
    </div>
  );
};
