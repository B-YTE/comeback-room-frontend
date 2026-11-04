import endedUrl from '@/assets/viewing-list/ended.svg';
import liveUrl from '@/assets/viewing-list/live.svg';
import lockUrl from '@/assets/viewing-list/lock.svg';
import scheduledUrl from '@/assets/viewing-list/scheduled.svg';
import type { ViewingRoom } from '@/features/room/types/viewingList';
import { cn } from '@/shared/utils/cn';

const STATUS = {
  live: { label: '진행 중', color: 'text-line-focus', icon: liveUrl },
  ended: { label: '진행 종료', color: 'text-label-assistive', icon: endedUrl },
  scheduled: {
    label: '진행 예정',
    color: 'text-accent-engagement-foreground',
    icon: scheduledUrl,
  },
};

export const ViewingRoomCard = ({ room }: { room: ViewingRoom }) => {
  const status = STATUS[room.status];
  const date = new Date(room.viewedAt);
  const dateLabel = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(date)
    .replace(/\.$/, '');
  const timeLabel = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(date);

  return (
    <li
      className={cn(
        'flex min-w-0 flex-col gap-8 rounded-extralarge border border-line-normal bg-background-surface p-6 sm:flex-row sm:items-center',
        room.status === 'live' && 'border-line-focus',
      )}
    >
      <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-large sm:w-94">
        <img src={room.thumbnail} alt="" className="size-full object-cover" />
        {room.isPrivate && (
          <span className="absolute top-0 left-0 flex items-center gap-1 rounded-medium bg-background-scrim px-3 py-1.5 typo-title-18-medium text-static-white">
            <img src={lockUrl} alt="" />
            비공개
          </span>
        )}
        <span className="absolute right-2 bottom-2 rounded-small bg-background-scrim px-3 py-1 typo-body-medium text-label-strong">
          {room.duration}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="typo-heading-semibold-36 text-label-strong">{room.title}</h2>
          <p className="typo-heading-h4 text-label-assistive">{room.description}</p>
        </div>
        <ul aria-label="태그" className="flex flex-wrap gap-4">
          {room.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-background-elevated px-8 py-3 typo-heading-h4 text-label-neutral"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex shrink-0 flex-col gap-3 sm:ml-auto sm:h-52.75 sm:items-end sm:py-4.5">
        <time dateTime={room.viewedAt} className="flex gap-5 typo-heading-h4 text-label-assistive">
          <span>{dateLabel}</span>
          <span>{timeLabel}</span>
        </time>
        <p className={cn('flex items-center gap-4 typo-heading-bold-28', status.color)}>
          {status.label}
          <img src={status.icon} alt="" />
        </p>
      </div>
    </li>
  );
};
