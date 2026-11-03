import { type ComponentProps } from 'react';

import { cn } from '@/shared/utils/cn';

// 로그인·아이디 찾기 등 인증 화면 가운데의 분홍 테두리 카드. 기본 폭은 Figma 650px
export const AuthCard = ({ className, ...props }: ComponentProps<'section'>) => {
  return (
    <section
      className={cn(
        'mx-auto mt-40 mb-35 flex w-162.5 flex-col items-center gap-20 rounded-extralarge border border-line-focus bg-background-surface p-14',
        className,
      )}
      {...props}
    />
  );
};
