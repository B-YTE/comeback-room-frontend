import { useEffect, useState } from 'react';

export type RoomSortOption = 'latest' | 'participants' | 'startTime';
export type RoomVisibilityOption = 'all' | 'private' | 'public';

export interface RoomFilterOptions {
  sort: RoomSortOption;
  visibility: RoomVisibilityOption;
}

interface RoomFilterDialogProps {
  initialFilters?: RoomFilterOptions;
  onClose: () => void;
  onApply: (filters: RoomFilterOptions) => void;
}

const DEFAULT_FILTERS: RoomFilterOptions = {
  sort: 'latest',
  visibility: 'all',
};

export const RoomFilterDialog = ({
  initialFilters = DEFAULT_FILTERS,
  onClose,
  onApply,
}: RoomFilterDialogProps) => {
  const [sort, setSort] = useState<RoomSortOption>(initialFilters.sort);
  const [visibility, setVisibility] = useState<RoomVisibilityOption>(initialFilters.visibility);

  useEffect(() => {
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const optionStyle = (selected: boolean) =>
    `flex h-12 min-w-0 flex-1 items-center justify-center rounded-[8px] border px-2 text-center typo-caption transition-colors ${
      selected
        ? 'border-[#C41449] bg-[#900D31] text-white'
        : 'border-line-normal bg-transparent text-label-neutral hover:border-label-neutral'
    }`;

  const resetFilters = () => {
    setSort('latest');
    setVisibility('all');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-filter-title"
        className="relative flex min-h-[480px] w-full max-w-[480px] flex-col rounded-[14px] border border-line-normal px-12 pt-16 pb-10 shadow-xl"
        style={{ backgroundColor: '#222127' }}
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          aria-label="필터 닫기"
          onClick={onClose}
          className="absolute top-5 right-5 text-2xl text-label-neutral hover:text-label-strong"
        >
          ×
        </button>

        {/* 제목 */}
        <h2
          id="room-filter-title"
          className="mb-10 text-center typo-heading-semibold-36 text-label-strong"
        >
          시청방 필터
        </h2>

        {/* 정렬 방식 */}
        <fieldset className="mb-8">
          <legend className="mb-3 typo-label-medium text-label-neutral">정렬 방식</legend>

          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={sort === 'latest'}
              onClick={() => setSort('latest')}
              className={optionStyle(sort === 'latest')}
            >
              최신순
            </button>

            <button
              type="button"
              aria-pressed={sort === 'participants'}
              onClick={() => setSort('participants')}
              className={optionStyle(sort === 'participants')}
            >
              참여 인원순
            </button>

            <button
              type="button"
              aria-pressed={sort === 'startTime'}
              onClick={() => setSort('startTime')}
              className={optionStyle(sort === 'startTime')}
            >
              시작 일자순
            </button>
          </div>
        </fieldset>

        {/* 공개 여부 */}
        <fieldset className="mb-10">
          <legend className="mb-3 typo-label-medium text-label-neutral">공개 여부</legend>

          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={visibility === 'all'}
              onClick={() => setVisibility('all')}
              className={optionStyle(visibility === 'all')}
            >
              전체
            </button>

            <button
              type="button"
              aria-pressed={visibility === 'private'}
              onClick={() => setVisibility('private')}
              className={optionStyle(visibility === 'private')}
            >
              비공개
            </button>

            <button
              type="button"
              aria-pressed={visibility === 'public'}
              onClick={() => setVisibility('public')}
              className={optionStyle(visibility === 'public')}
            >
              공개
            </button>
          </div>
        </fieldset>

        {/* 하단 버튼 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={resetFilters}
            className="flex h-12 w-[100px] shrink-0 items-center justify-center gap-2 rounded-[8px] border border-line-normal bg-background-subtle typo-label-medium text-label-neutral hover:bg-background-surface"
          >
            <span aria-hidden="true">↶</span>
            초기화
          </button>

          <button
            type="button"
            onClick={() => onApply({ sort, visibility })}
            className="h-12 flex-1 rounded-[8px] bg-primary-normal typo-label-medium text-white hover:bg-primary-hover"
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};
