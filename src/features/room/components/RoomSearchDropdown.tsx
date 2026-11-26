import { IconClock, IconSearch } from '@/shared/ui/icons';

interface RoomSearchDropdownProps {
  keywords: string[];
  isRecent: boolean;
  onSelect: (keyword: string) => void;
}

export const RoomSearchDropdown = ({ keywords, isRecent, onSelect }: RoomSearchDropdownProps) => {
  if (keywords.length === 0) return null;

  return (
    <div className="absolute top-full left-0 z-50 mt-4 w-full overflow-hidden rounded-medium border border-line-normal bg-background-surface/90 py-4 shadow-lg">
      {keywords.map((keyword) => (
        <button
          key={keyword}
          type="button"
          onClick={() => onSelect(keyword)}
          className="flex w-full items-center gap-4 px-6 py-3 text-left text-label-normal hover:bg-background-interactive"
        >
          {isRecent ? (
            <IconClock className="size-7 shrink-0 text-label-neutral" />
          ) : (
            <IconSearch className="size-7 shrink-0 text-label-neutral" />
          )}

          <span className="typo-body-large">{keyword}</span>
        </button>
      ))}
    </div>
  );
};
