import { useId, useState, type FormEvent } from 'react';

import { Button } from '@/shared/ui/Button';
import { ChipButton } from '@/shared/ui/Chip';
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
  const handleAddFilter = (event: FormEvent<HTMLFormElement>) => {
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
          aria-controls={`${id}-add`}
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
        <form id={`${id}-add`} onSubmit={handleAddFilter} className="flex max-w-160 flex-col gap-3">
          <label htmlFor={`${id}-artist`} className="typo-body-large">
            아티스트 이름 (현재 화면에서만 유지됩니다)
          </label>
          <div className="flex gap-3">
            <TextField
              autoFocus
              id={`${id}-artist`}
              name="artist"
              maxLength={20}
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
            />
            <Button type="submit" className="w-auto shrink-0">
              추가
            </Button>
          </div>
          {error && (
            <p id={`${id}-error`} role="alert" className="typo-body-medium text-status-negative">
              {error}
            </p>
          )}
        </form>
      )}
    </>
  );
};
