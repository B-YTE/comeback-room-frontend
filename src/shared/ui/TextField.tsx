import { type ComponentProps } from 'react';

import { cn } from '@/shared/utils/cn';

// Figma 디자인시스템 > TextField (node 463:174)
export const TextField = ({ className, ...props }: ComponentProps<'input'>) => {
  return (
    <input
      className={cn(
        'h-14 w-full rounded-medium border border-line-normal bg-transparent px-6 py-3 typo-title-20-regular text-label-normal outline-none placeholder:text-label-neutral focus:border-line-focus',
        className,
      )}
      {...props}
    />
  );
};
