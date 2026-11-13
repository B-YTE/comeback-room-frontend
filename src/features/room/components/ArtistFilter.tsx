import { useId, useState, type SubmitEvent } from 'react';

import { Button } from '@/shared/ui/Button';
import { ChipButton } from '@/shared/ui/Chip';
import { Dialog } from '@/shared/ui/Dialog';
import { TextField } from '@/shared/ui/TextField';
import { IconPlus } from '@/shared/ui/icons';

const INITIAL_FILTERS = ['에스파', '카리나', '아이브', '장원영'];

interface ArtistFilterProps {
  selected: string;
  onSelect: (artist: string) => void;
}

export const ArtistFilter = ({ selected, onSelect }: ArtistFilterProps) => {
  const id = useId();
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const handleAddFilter = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get('artist');
    const artist = typeof value === 'string' ? value.trim() : '';
    if (!artist || artist.length > 20 || artist === '전체' || filters.includes(artist)) {
      setError('중복되지 않는 1~20자의 아티스트 이름을 입력해주세요.');
      return;
    }
    setFilters([...filters, artist]);
    onSelect(artist);
    setIsAdding(false);
    setError('');
  };

  return (
    <>
      <div className="-mt-4 flex flex-wrap gap-4" role="group" aria-label="아티스트 필터">
        {['전체', ...filters].map((filter) => (
          <ChipButton
            key={filter}
            type="button"
            selected={selected === filter}
            onClick={() => onSelect(filter)}
          >
            {filter}
          </ChipButton>
        ))}
        <ChipButton
          variant="add"
          type="button"
          aria-expanded={isAdding}
          aria-haspopup="dialog"
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
        <Dialog
          title="항목 추가"
          description="시청 목록을 필터링할 해시태그를 추가해보세요."
          onClose={() => setIsAdding(false)}
        >
          <form id={`${id}-add`} onSubmit={handleAddFilter} className="flex flex-col gap-8">
            <TextField
              data-dialog-autofocus
              id={`${id}-artist`}
              aria-label="아티스트 이름"
              placeholder="# 추가할 해시태그를 입력해주세요."
              name="artist"
              maxLength={20}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            {error && (
              <p id={`${id}-error`} role="alert" className="typo-body-medium text-status-negative">
                {error}
              </p>
            )}
            <div className="grid grid-cols-2 gap-4.5">
              <Button variant="secondary" onClick={() => setIsAdding(false)}>
                취소
              </Button>
              <Button type="submit">추가하기</Button>
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
};
