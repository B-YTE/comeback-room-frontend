import type { ReactNode } from 'react';

import { Button } from '@/shared/ui/Button';
import { Dialog } from '@/shared/ui/Dialog';

interface ConfirmDialogProps {
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm?: () => void;
  isPending?: boolean;
  children?: ReactNode;
}

export const ConfirmDialog = ({
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
  children,
  isPending = false,
}: ConfirmDialogProps) => (
  <Dialog title={title} description={description} onClose={onClose}>
    {children}
    <div className="grid grid-cols-2 gap-4.5">
      <Button variant="secondary" data-dialog-autofocus onClick={onClose}>
        취소
      </Button>
      <Button disabled={!onConfirm || isPending} onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </div>
  </Dialog>
);
