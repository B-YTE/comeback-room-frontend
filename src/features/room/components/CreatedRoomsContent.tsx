import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCreatedRoom } from '@/features/room/api/createdRooms';
import { getErrorMessage } from '@/shared/api/getErrorMessage';

import { RoomEntryDialog } from '@/features/room/components/RoomEntryDialog';
import { useRoomEntry } from '@/features/room/hooks/useRoomEntry';
import { ArtistFilter } from '@/features/room/components/ArtistFilter';
import { DeleteRoomDialog } from '@/features/room/components/DeleteRoomDialog';
import { RoomCardActions } from '@/features/room/components/RoomCardActions';
import type { CreatedRoom } from '@/features/room/types/createdRooms';
import { useCreatedRooms } from '@/features/room/hooks/useCreatedRooms';
import { Button } from '@/shared/ui/Button';
import { Pagination } from '@/shared/ui/Pagination';
import { Playlist } from '@/shared/ui/Playlist';

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
  const entry = useRoomEntry();
  const [deleting, setDeleting] = useState<CreatedRoom | null>(null);
  const [selected, setSelected] = useState('전체');
  const [page, setPage] = useState(1);
  const client = useQueryClient();
  const { data, isPending, isError, refetch } = useCreatedRooms(selected, page - 1);
  const pageCount = data?.totalPages ?? 0;
  const currentPage = page;
  const visibleRooms = data?.rooms ?? [];
  const deletion = useMutation({
    mutationFn: deleteCreatedRoom,
    onSuccess: async () => {
      setDeleting(null);
      if (visibleRooms.length === 1 && page > 1) setPage(page - 1);
      await client.invalidateQueries({ queryKey: ['created-rooms'] });
    },
  });

  return (
    <div className="mt-17 mb-20 flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 tabIndex={-1} className="typo-display-medium">
          내가 만든 시청방
        </h1>
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
      ) : visibleRooms.length === 0 ? (
        <p role="status" className="py-16 text-center typo-heading-h4 text-label-neutral">
          {selected === '전체'
            ? '아직 만든 시청방이 없습니다.'
            : `${selected} 태그로 만든 시청방이 없습니다.`}
        </p>
      ) : (
        <>
          <ul aria-label="내가 만든 시청방" className="flex flex-col gap-8">
            {visibleRooms.map((room) => (
              <li key={room.id}>
                <Playlist
                  {...room}
                  onOpen={() => entry.handleOpen(room)}
                  actions={
                    <RoomCardActions
                      title={room.title}
                      isPrivate={Boolean(room.showPrivateRoom)}
                      entryCode={room.entryCode}
                      deletable={room.deletable && !deletion.isPending}
                      onDelete={() => {
                        if (deletion.isPending) return;
                        deletion.reset();
                        setDeleting(room);
                      }}
                    />
                  }
                  dateTime={room.startsAt}
                  date={DATE_FORMAT.format(new Date(room.startsAt)).replace(/\.$/, '')}
                  time={TIME_FORMAT.format(new Date(room.startsAt))}
                />
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
          </div>
        </>
      )}
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
      {deleting && (
        <DeleteRoomDialog
          title={deleting.title}
          onClose={() => setDeleting(null)}
          isPending={deletion.isPending}
          error={deletion.isError ? getErrorMessage(deletion.error) : undefined}
          onConfirm={() => {
            if (!deletion.isPending && deleting.deletable) deletion.mutate(deleting.id);
          }}
        />
      )}
      <p className="typo-body-medium text-label-assistive">
        {import.meta.env.DEV
          ? '개발용 예시 목록입니다. 변경 사항은 실제 서버에 저장되지 않습니다.'
          : '생성한 시청방 조회는 서버 구현을 기다리고 있습니다.'}
      </p>
    </div>
  );
};
