import type { ComponentProps, ReactNode } from 'react';

import lockUrl from '@/assets/viewing-list/lock.svg';
import { Chip } from '@/shared/ui/Chip';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { cn } from '@/shared/utils/cn';

interface PlaylistProps {
  title: string;
  subtitle: string;
  thumbnail: string;
  duration: string;
  tags: readonly string[];
  dateTime: string;
  date: string;
  time: string;
  status: ComponentProps<typeof StatusBadge>['status'];
  showPrivateRoom?: boolean;
  actions?: ReactNode;
  onOpen?: () => void;
}

// Figma GUI > component > Playlist (568:5771)
// 데이터 조회·날짜 변환은 사용하는 기능에서 처리한다.
export const Playlist = ({
  title,
  subtitle,
  thumbnail,
  duration,
  tags,
  dateTime,
  date,
  time,
  status,
  showPrivateRoom = false,
  actions,
  onOpen,
}: PlaylistProps) => {
  return (
    <article
      tabIndex={onOpen ? undefined : 0}
      className={cn(
        'relative flex min-w-0 flex-col gap-8 rounded-extralarge border border-line-normal bg-background-surface p-6 lg:flex-row lg:items-center',
        'hover:border-line-focus active:border-line-focus focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus',
      )}
    >
      {onOpen && (
        <button
          type="button"
          aria-label={`${title} 입장`}
          onClick={onOpen}
          className="absolute inset-0 z-10 rounded-extralarge focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus"
        />
      )}
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-large sm:w-94">
        <img src={thumbnail} alt="" className="size-full object-cover" />
        {showPrivateRoom && (
          <span className="absolute top-0 left-0 flex items-center gap-1 rounded-medium bg-background-scrim px-3 py-1.5 typo-title-18-medium text-static-white">
            <img src={lockUrl} alt="" />
            비공개
          </span>
        )}
        <span className="absolute right-2 bottom-2 rounded-small bg-background-scrim px-3 py-1 typo-body-medium text-label-strong">
          {duration}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="typo-heading-semibold-36 text-label-strong">{title}</h2>
          <p className="typo-heading-h4 text-label-assistive">{subtitle}</p>
        </div>
        <ul aria-label="태그" className="flex flex-wrap gap-4">
          {tags.map((tag) => (
            <li key={tag}>
              <Chip>{tag}</Chip>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex shrink-0 flex-col gap-3 lg:ml-auto lg:min-h-52.75 lg:items-end lg:py-4.5">
        <time dateTime={dateTime} className="flex gap-5 typo-heading-h4 text-label-assistive">
          <span>{date}</span>
          <span>{time}</span>
        </time>
        <StatusBadge status={status} />
        {actions && (
          <div className="relative z-20 mt-auto flex flex-wrap items-center gap-3 pt-3">
            {actions}
          </div>
        )}
      </div>
    </article>
  );
};
