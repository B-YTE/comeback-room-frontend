import type { IconProps } from '@/shared/ui/icons/types';

// Figma에 체크 상태 디자인이 없어 임의로 그림
export const IconCheck = (props: IconProps) => (
  <svg width={24} height={24} viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
    <path
      d="M6.5 12.5L10.5 16.5L17.5 8.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
