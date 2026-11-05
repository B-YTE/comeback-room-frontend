import type { ComponentProps } from 'react';

import endedUrl from '@/assets/viewing-list/ended.svg';
import liveUrl from '@/assets/viewing-list/live.svg';
import scheduledUrl from '@/assets/viewing-list/scheduled.svg';
import { cn } from '@/shared/utils/cn';

interface StatusBadgeProps extends ComponentProps<'p'> {
  status: 'live' | 'ended' | 'scheduled';
}

const STATUS = {
  live: { label: '진행 중', color: 'text-line-focus', icon: liveUrl },
  ended: { label: '진행 종료', color: 'text-label-assistive', icon: endedUrl },
  scheduled: {
    label: '진행 예정',
    color: 'text-accent-engagement-foreground',
    icon: scheduledUrl,
  },
};

// Figma GUI > component > Status Badge (568:5740)
export const StatusBadge = ({ status, className, ...props }: StatusBadgeProps) => {
  const { label, color, icon } = STATUS[status];

  return (
    <p className={cn('flex items-center gap-4 typo-heading-bold-28', color, className)} {...props}>
      {label}
      <img src={icon} alt="" />
    </p>
  );
};
