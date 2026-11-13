import { useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import {
  getRoomDetail,
  getSubscription,
  joinPrivateRoom,
  subscribeRoom,
} from '@/features/room/api/roomEntry';
import { roomTime } from '@/features/room/api/roomMapping';
import type { RoomEntryDialogState, RoomEntryTarget } from '@/features/room/types/roomEntry';
import type { ApiErrorResponse } from '@/types/api';
import { getErrorMessage } from '@/shared/api/getErrorMessage';

export const useRoomEntry = (onEnter?: (roomId: string) => void) => {
  const [dialog, setDialog] = useState<RoomEntryDialogState | null>(null);
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);
  const busy = useRef(false);
  const generation = useRef(0);
  const handleClose = () => {
    generation.current++;
    setDialog(null);
    setError('');
  };
  const run = async (action: (current: () => boolean) => Promise<void>) => {
    if (busy.current) return;
    busy.current = true;
    setIsPending(true);
    setError('');
    const version = generation.current;
    const current = () => generation.current === version;
    try {
      await action(current);
    } catch (error) {
      if (current())
        setError(
          error instanceof Error && !isAxiosError(error) ? error.message : getErrorMessage(error),
        );
    } finally {
      busy.current = false;
      setIsPending(false);
    }
  };
  const handleOpen = (room: RoomEntryTarget) =>
    run(async (current) => {
      const detail = await getRoomDetail(room.id);
      if (!current()) return;
      // Ended rooms use another team's report flow; do not call participants here.
      if (detail.status === 'ENDED') return;
      if (!detail.joinable) {
        if (detail.isPublic && detail.enterableAt) {
          const subscription = await getSubscription(room.id);
          if (current())
            setDialog({
              kind: subscription.subscribed ? 'subscribed' : 'subscribe',
              roomId: room.id,
              opensAt: roomTime(detail.enterableAt),
            });
        } else {
          setError('지금은 입장할 수 없는 시청방입니다.');
        }
        return;
      }
      if ((detail.currentParticipants ?? 0) >= detail.maxParticipants) {
        setDialog({ kind: 'full' });
        return;
      }
      if (!detail.isPublic && !detail.isHost && !room.hasWatchingHistory) {
        setDialog({ kind: 'code', roomId: room.id });
        return;
      }
      onEnter?.(room.id);
    });
  const handleSubscribe = () =>
    run(async (current) => {
      if (dialog?.kind !== 'subscribe') return;
      try {
        await subscribeRoom(dialog.roomId);
      } catch (error) {
        if (
          isAxiosError<ApiErrorResponse>(error) &&
          error.response?.data.code === 'NOTIFICATION_ALREADY_SUBSCRIBED'
        ) {
          const subscription = await getSubscription(dialog.roomId);
          if (current() && subscription.subscribed) {
            setDialog({ ...dialog, kind: 'subscribed' });
            return;
          }
        }
        throw error;
      }
      if (current()) handleClose();
    });
  const handleEnter = (privateCode: string) =>
    run(async (current) => {
      if (dialog?.kind !== 'code') return;
      try {
        await joinPrivateRoom(dialog.roomId, { privateCode });
      } catch (error) {
        if (
          current() &&
          isAxiosError<ApiErrorResponse>(error) &&
          error.response?.data.code === 'ROOM_FULL'
        ) {
          setDialog({ kind: 'full' });
          return;
        }
        // Includes PRIVATE_CODE_REQUIRED, INVALID_PRIVATE_CODE and ROOM_NOT_JOINABLE.
        throw error;
      }
      if (current()) {
        onEnter?.(dialog.roomId);
        handleClose();
      }
    });
  return { dialog, error, isPending, handleOpen, handleClose, handleSubscribe, handleEnter };
};
