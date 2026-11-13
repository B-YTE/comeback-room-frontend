import { useState } from 'react';

import type { RoomEntryDialogState, RoomEntryTarget } from '@/features/room/types/roomEntry';

export const useRoomEntry = (onEnter?: (roomId: string) => void) => {
  const [dialog, setDialog] = useState<RoomEntryDialogState | null>(null);
  const [subscribedIds, setSubscribedIds] = useState<string[]>([]);
  const handleClose = () => setDialog(null);
  const handleOpen = (room: RoomEntryTarget) => {
    switch (room.entry?.kind) {
      case 'full':
        setDialog({ kind: 'full' });
        break;
      case 'not-open':
        setDialog({
          kind:
            room.entry.subscribed || subscribedIds.includes(room.id) ? 'subscribed' : 'subscribe',
          roomId: room.id,
          opensAt: room.entry.opensAt,
        });
        break;
      case 'code-required':
        setDialog({ kind: 'code', roomId: room.id, expectedCode: room.entryCode });
        break;
      default:
        // 기존 목록은 입장 라우트가 미구현이다. 연결 시 정상 입장은 이 콜백을 통해 진행한다.
        onEnter?.(room.id);
    }
  };
  const handleSubscribe = () => {
    if (dialog?.kind !== 'subscribe') return;
    setSubscribedIds((ids) => (ids.includes(dialog.roomId) ? ids : [...ids, dialog.roomId]));
    handleClose();
  };
  const handleEnter = () => {
    if (dialog?.kind !== 'code') return;
    onEnter?.(dialog.roomId);
    handleClose();
  };
  return { dialog, handleOpen, handleClose, handleSubscribe, handleEnter };
};
