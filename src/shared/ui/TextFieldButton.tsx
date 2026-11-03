import { type ComponentProps } from 'react';

import { cn } from '@/shared/utils/cn';

// Figma 디자인시스템 > TextField/회원가입 버튼. 입력창 옆에 붙는 흰 버튼 (인증번호 발송 등)
export const TextFieldButton = ({
  type = 'button',
  className,
  ...props
}: ComponentProps<'button'>) => {
  return (
    <button
      type={type}
      className={cn(
        'h-14 w-39 shrink-0 rounded-medium bg-label-normal px-6 typo-title-20-semibold text-background-base disabled:bg-background-disabled disabled:text-label-disabled',
        className,
      )}
      {...props}
    />
  );
};
