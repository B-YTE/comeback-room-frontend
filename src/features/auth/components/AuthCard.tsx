import { type ComponentProps } from 'react';

import { cn } from '@/shared/utils/cn';

// 로그인·아이디 찾기 등 인증 화면 가운데의 분홍 테두리 카드. 기본 폭은 Figma 650px
// 상단바를 뺀 남은 높이의 세로 가운데에 놓이고, 화면보다 길면 위아래 py-10만 남긴다
export const AuthCard = ({ className, ...props }: ComponentProps<'section'>) => {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <section
        className={cn(
          'flex w-162.5 flex-col items-center gap-20 rounded-extralarge border border-line-focus bg-background-surface p-14',
          className,
        )}
        {...props}
      />
    </div>
  );
};
