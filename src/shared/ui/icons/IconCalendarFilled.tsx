import type { IconProps } from '@/shared/ui/icons/types';

export const IconCalendarFilled = (props: IconProps) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M8 2V6M16 2V6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M23 18C23 20.7614 20.7614 23 18 23H6C3.23858 23 1 20.7614 1 18V11H23V18ZM18 3C20.7614 3 23 5.23858 23 8V9H1V8C1 5.23858 3.23858 3 6 3H18Z"
      fill="currentColor"
    />
  </svg>
);
