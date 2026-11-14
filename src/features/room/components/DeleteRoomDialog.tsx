import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';

interface DeleteRoomDialogProps {
  title: string;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  error?: string;
}

export const DeleteRoomDialog = ({
  title,
  onClose,
  onConfirm,
  isPending = false,
  error,
}: DeleteRoomDialogProps) => (
  <ConfirmDialog
    title="시청방을 삭제하시겠어요?"
    description="삭제한 시청방은 복구할 수 없습니다."
    confirmLabel="삭제하기"
    onConfirm={onConfirm}
    isPending={isPending}
    onClose={onClose}
  >
    <p className="truncate text-center typo-body-medium text-label-neutral">{title}</p>
    {error && (
      <p role="alert" className="typo-body-medium text-status-negative">
        {error}
      </p>
    )}
  </ConfirmDialog>
);
