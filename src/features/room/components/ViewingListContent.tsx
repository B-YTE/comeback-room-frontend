import { useState, type FormEvent } from 'react';

import { ViewingRoomCard } from '@/features/room/components/ViewingRoomCard';
import { useViewingList } from '@/features/room/hooks/useViewingList';
import { Button } from '@/shared/ui/Button';
import { ChipButton } from '@/shared/ui/Chip';
import { TextField } from '@/shared/ui/TextField';
import { IconPlus } from '@/shared/ui/icons';

const INITIAL_FILTERS = ['에스파', '카리나', '아이브', '장원영'];

export const ViewingListContent = () => {
  const { data: rooms = [], isPending, isError, refetch } = useViewingList();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [selected, setSelected] = useState('전체');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const visibleRooms =
    selected === '전체' ? rooms : rooms.filter((room) => room.tags.includes(selected));

  const handleAddFilter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('artist');
    const artist = typeof value === 'string' ? value.trim() : '';
    if (!artist || artist.length > 20 || artist === '전체' || filters.includes(artist)) {
      setError('중복되지 않는 1~20자의 아티스트 이름을 입력해주세요.');
      return;
    }
    setFilters([...filters, artist]);
    setSelected(artist);
    setIsAdding(false);
    setError('');
  };

  return (
    <div className="mt-17 mb-20 flex flex-col gap-10">
      <header className="flex flex-col gap-2">
        <h1 className="typo-display-medium">내 시청 목록</h1>
        <p className="typo-heading-h4 text-label-neutral">
          함께했던 시청방의 순간을 다시 만나보세요.
        </p>
      </header>
      <div className="-mt-4 flex flex-wrap gap-4" role="group" aria-label="아티스트 필터">
        {['전체', ...filters].map((filter) => (
          <ChipButton
            key={filter}
            type="button"
            selected={selected === filter}
            onClick={() => setSelected(filter)}
          >
            {filter}
          </ChipButton>
        ))}
        <ChipButton
          variant="add"
          type="button"
          aria-expanded={isAdding}
          aria-controls="add-artist"
          onClick={() => {
            setIsAdding(!isAdding);
            setError('');
          }}
        >
          <IconPlus className="size-6" />
          항목 추가
        </ChipButton>
      </div>
      {isAdding && (
        <form id="add-artist" onSubmit={handleAddFilter} className="flex max-w-160 flex-col gap-3">
          <label htmlFor="artist" className="typo-body-large">
            아티스트 이름 (현재 화면에서만 유지됩니다)
          </label>
          <div className="flex gap-3">
            <TextField
              autoFocus
              id="artist"
              name="artist"
              maxLength={20}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? 'artist-error' : undefined}
            />
            <Button type="submit" className="w-auto shrink-0">
              추가
            </Button>
          </div>
          {error && (
            <p id="artist-error" role="alert" className="typo-body-medium text-status-negative">
              {error}
            </p>
          )}
        </form>
      )}
      {isPending ? (
        <p role="status" className="py-16 typo-body-large">
          시청 목록을 불러오는 중입니다.
        </p>
      ) : isError ? (
        <div role="alert" className="flex flex-col items-start gap-6 py-16">
          <p>시청 목록을 불러오지 못했습니다.</p>
          <Button onClick={() => void refetch()} className="w-auto">
            다시 시도
          </Button>
        </div>
      ) : visibleRooms.length === 0 ? (
        <p role="status" className="py-16 text-center typo-heading-h4 text-label-neutral">
          {selected === '전체'
            ? '아직 시청 목록이 없습니다.'
            : `${selected}의 시청 목록이 없습니다.`}
        </p>
      ) : (
        <ul aria-label="내 시청 목록" className="flex flex-col gap-8">
          {visibleRooms.map((room) => (
            <ViewingRoomCard key={room.id} room={room} />
          ))}
        </ul>
      )}
      <p className="typo-body-medium text-label-assistive">
        {import.meta.env.DEV ? '개발용 예시 목록입니다. ' : ''}실제 시청 목록과 시청방 이동 기능은
        서버 연동 후 제공됩니다.
      </p>
    </div>
  );
};
