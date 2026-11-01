import type { IconProps } from '@/shared/ui/icons/types';

export const IconClose = (props: IconProps) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path d="M6 6.25L18 18.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 6.25L6 18.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
