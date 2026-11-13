import { useEffect, useId, useRef, type ReactNode } from 'react';

import { IconClose } from '@/shared/ui/icons';

interface DialogProps {
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}

// Figma 항목 추가/삭제 팝업 공통 프레임. Native dialog가 focus trap과 배경 inert를 처리한다.
export const Dialog = ({ title, description, onClose, children }: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const opener = document.activeElement;
    const dialog = ref.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog?.showModal();
    dialog?.querySelector<HTMLElement>('[data-dialog-autofocus]')?.focus();
    return () => {
      dialog?.close();
      document.body.style.overflow = overflow;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
      else document.querySelector<HTMLElement>('main h1')?.focus();
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== 'Tab') return;
        const controls = event.currentTarget.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), [tabindex="0"]',
        );
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      className="fixed inset-0 m-auto max-h-[90dvh] w-175 max-w-[calc(100%_-_2rem)] overflow-y-auto rounded-extralarge border border-line-normal bg-background-surface px-6 py-16 text-label-normal backdrop:bg-background-scrim sm:px-20 sm:py-24"
    >
      <button
        type="button"
        aria-label="팝업 닫기"
        onClick={onClose}
        className="absolute top-7 right-7 rounded-small text-label-neutral hover:text-label-strong focus-visible:outline-2 focus-visible:outline-line-focus"
      >
        <IconClose className="size-8" />
      </button>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-5 text-center">
          <h2 id={`${id}-title`} className="typo-heading-h1 text-label-strong">
            {title}
          </h2>
          <p id={`${id}-description`} className="typo-heading-h4 text-label-neutral">
            {description}
          </p>
        </div>
        {children}
      </div>
    </dialog>
  );
};
