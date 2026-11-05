import type { ComponentProps } from 'react';

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
}: PlaylistProps) => {
  return (
    <article
      className={cn(
        'flex min-w-0 flex-col gap-8 rounded-extralarge border border-line-normal bg-background-surface p-6 sm:flex-row sm:items-center',
        status === 'live' && 'border-line-focus',
      )}
    >
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
      <div className="flex shrink-0 flex-col gap-3 sm:ml-auto sm:h-52.75 sm:items-end sm:py-4.5">
        <time dateTime={dateTime} className="flex gap-5 typo-heading-h4 text-label-assistive">
          <span>{date}</span>
          <span>{time}</span>
        </time>
        <StatusBadge status={status} />
      </div>
    </article>
  );
};
