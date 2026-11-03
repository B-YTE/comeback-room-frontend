import { type ComponentProps } from 'react';

import { cn } from '@/shared/utils/cn';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

// Figma 디자인시스템 > ActionButton (node 463:111)
export const Button = ({
  variant = 'primary',
  type = 'button',
  className,
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={cn(
        'flex w-full items-center justify-center gap-3 rounded-medium px-4 py-4 typo-heading-h3 disabled:bg-background-disabled disabled:text-label-disabled',
        variant === 'primary' &&
          'bg-primary-normal text-label-strong hover:bg-primary-hover active:bg-primary-pressed',
        variant === 'secondary' &&
          'border border-line-normal bg-background-elevated text-label-normal hover:bg-interaction-hover active:bg-interaction-pressed',
        className,
      )}
      {...props}
    />
  );
};
