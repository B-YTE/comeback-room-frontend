import type { ComponentProps } from 'react';

import { cn } from '@/shared/utils/cn';

const CHIP_CLASSES = 'inline-flex items-center gap-3 rounded-full px-8 py-3 typo-heading-h4';

// Figma Playlist 태그(568:5723)와 시청 목록 아티스트 필터(565:5575)
export const Chip = ({ className, ...props }: ComponentProps<'span'>) => (
  <span
    className={cn(CHIP_CLASSES, 'bg-background-elevated text-label-neutral', className)}
    {...props}
  />
);

type ChipButtonProps = ComponentProps<'button'> &
  ({ variant?: 'filter'; selected: boolean } | { variant: 'add'; selected?: never });

export const ChipButton = ({
  variant = 'filter',
  selected,
  type = 'button',
  className,
  ...props
}: ChipButtonProps) => (
  <button
    type={type}
    aria-pressed={variant === 'filter' ? selected : undefined}
    className={cn(
      CHIP_CLASSES,
      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus disabled:cursor-not-allowed disabled:text-label-disabled',
      variant === 'add'
        ? 'border border-dashed border-line-normal text-label-neutral'
        : selected
          ? 'bg-static-white text-primary-foreground'
          : 'bg-background-elevated text-label-neutral hover:bg-interaction-hover',
      className,
    )}
    {...props}
  />
);
