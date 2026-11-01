import type { IconProps } from '@/shared/ui/icons/types';

export const IconSearch = (props: IconProps) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <circle
      cx="10.5"
      cy="10.5"
      r="7.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
