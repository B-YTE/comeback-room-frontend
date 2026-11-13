import { Button } from '@/shared/ui/Button';
import { Dialog } from '@/shared/ui/Dialog';

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
  <Dialog
    title="시청방을 삭제하시겠어요?"
    description="삭제한 시청방은 복구할 수 없습니다."
    onClose={onClose}
  >
    <p className="truncate text-center typo-body-medium text-label-neutral">{title}</p>
    {error && (
      <p role="alert" className="typo-body-medium text-status-negative">
        {error}
      </p>
    )}
    <div className="grid grid-cols-2 gap-4.5">
      <Button variant="secondary" data-dialog-autofocus onClick={onClose}>
        취소
      </Button>
      <Button disabled={isPending} onClick={onConfirm}>
        삭제하기
      </Button>
    </div>
  </Dialog>
);
