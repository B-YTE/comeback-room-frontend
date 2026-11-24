import type { IconProps } from '@/shared/ui/icons/types';

// Figma 알림팝업(333:1392) 모두 읽음 체크
export const IconCheckStroke = (props: IconProps) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M4.5 12.75L10.5 18.75L19.5 5.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
