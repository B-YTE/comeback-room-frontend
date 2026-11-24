import { useRef } from 'react';
import { Link } from 'react-router-dom';

import type { Notification } from '@/features/notification/types/notification';
import { IconCheckStroke, IconChevronDown } from '@/shared/ui/icons';

interface NotificationPanelProps {
  /** 상단바 알림 버튼의 popoverTarget과 같은 값 */
  id: string;
  notifications: Notification[];
  onReadAll: () => void;
}

const relativeTime = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

// 2분 전 / 3시간 전 / 어제
const formatNotifiedAt = (value: string, now = Date.now()) => {
  const minutes = Math.floor((now - new Date(value).getTime()) / 60_000);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return relativeTime.format(-minutes, 'minute');
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return relativeTime.format(-hours, 'hour');
  return relativeTime.format(-Math.floor(hours / 24), 'day');
};

// Figma GUI > 알림팝업(333:1392). Native popover가 열고 닫기, Esc, 바깥 클릭 닫기를 처리한다.
export const NotificationPanel = ({ id, notifications, onReadAll }: NotificationPanelProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      id={id}
      popover="auto"
      aria-label="알림"
      // shortcut: 화면 오른쪽 위에 고정, 상단바 폭(max-w-480)을 넘는 화면에서는 버튼과 떨어진다. CSS anchor positioning 지원이 넓어지면 버튼에 붙인다.
      // 라운드는 Figma 30.83px(÷1.5)로 맞는 토큰이 없어 직접 넣었다.
      className="inset-auto top-34 right-16 m-0 h-351.25 max-h-[calc(100dvh_-_7rem)] w-188.75 max-w-[calc(100%_-_2rem)] flex-col gap-8 overflow-hidden rounded-[20.55px] border border-line-strong bg-background-surface px-8.5 pt-9.5 pb-7.5 text-label-normal open:flex"
    >
      <div className="flex items-center justify-between border-b border-line-strong pb-6">
        <h2 className="typo-heading-h1 text-label-strong">알림</h2>
        <button
          type="button"
          onClick={onReadAll}
          disabled={notifications.every((notification) => notification.isRead)}
          className="flex items-center gap-1.5 rounded-small typo-heading-regular text-label-assistive hover:text-label-neutral focus-visible:outline-2 focus-visible:outline-line-focus disabled:cursor-default disabled:hover:text-label-assistive"
        >
          모두 읽음
          <IconCheckStroke className="size-6" />
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="flex flex-1 items-center justify-center typo-heading-regular text-label-assistive">
          새로운 알림이 없어요.
        </p>
      ) : (
        <ul className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className="flex shrink-0 flex-col items-end gap-3 border-b border-line-strong p-6"
            >
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-10">
                  <img
                    src={notification.thumbnailUrl}
                    alt=""
                    className="size-25 shrink-0 rounded-full object-cover"
                  />
                  <div className="flex w-84.25 min-w-0 flex-col gap-1.5">
                    <p className="typo-heading-medium text-label-strong">{notification.title}</p>
                    <div className="flex flex-col text-label-neutral">
                      <p className="typo-title-20-regular">{notification.message}</p>
                      <p className="truncate typo-body-large">{notification.videoTitle}</p>
                    </div>
                  </div>
                </div>
                <time
                  dateTime={notification.createdAt}
                  className="shrink-0 typo-title-20-medium text-label-assistive"
                >
                  {formatNotifiedAt(notification.createdAt)}
                </time>
              </div>
              {notification.roomId !== undefined && (
                <Link
                  to={`/rooms/${notification.roomId}`}
                  onClick={() => ref.current?.hidePopover()}
                  className="flex items-center gap-1 rounded-small typo-title-20-medium text-interaction-focus hover:underline focus-visible:outline-2 focus-visible:outline-line-focus"
                >
                  시청하러 가기
                  <IconChevronDown className="size-6 -rotate-90" />
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}

      <p className="text-center typo-heading-regular text-label-assistive">
        모든 알림은 30일 후 자동 삭제됩니다.
      </p>
    </div>
  );
};
