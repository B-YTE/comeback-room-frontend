import backUrl from '@/assets/pagination/back.svg';
import { cn } from '@/shared/utils/cn';

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

const BUTTON_CLASSES =
  'flex size-16 shrink-0 max-sm:h-auto max-sm:w-full max-sm:aspect-square items-center justify-center rounded-medium bg-background-surface typo-heading-medium text-label-neutral hover:bg-interaction-hover focus-visible:outline-2 focus-visible:outline-line-focus disabled:cursor-not-allowed disabled:opacity-40';

// Figma component > pagenation (573:6464), arrow (573:6479)
export const Pagination = ({ page, pageCount, onPageChange }: PaginationProps) => {
  if (pageCount < 2) return null;
  const start = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => start + index);

  return (
    <nav
      aria-label="시청방 페이지"
      className="grid auto-cols-fr grid-flow-col gap-2 sm:flex sm:justify-center sm:gap-6"
    >
      <button
        type="button"
        aria-label="이전 페이지"
        disabled={page === 1}
        className={BUTTON_CLASSES}
        onClick={() => onPageChange(page - 1)}
      >
        <img src={backUrl} alt="" className="size-10" />
      </button>
      <div className="contents sm:flex sm:gap-4">
        {pages.map((number) => (
          <button
            key={number}
            type="button"
            aria-label={`${number}페이지`}
            aria-current={number === page ? 'page' : undefined}
            className={cn(
              BUTTON_CLASSES,
              number === page && 'bg-primary-normal text-label-strong hover:bg-primary-hover',
            )}
            onClick={() => onPageChange(number)}
          >
            {number}
          </button>
        ))}
      </div>
      <button
        type="button"
        aria-label="다음 페이지"
        disabled={page === pageCount}
        className={BUTTON_CLASSES}
        onClick={() => onPageChange(page + 1)}
      >
        <img src={backUrl} alt="" className="size-10 -scale-x-100" />
      </button>
    </nav>
  );
};
