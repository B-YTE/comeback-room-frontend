import { useId, useState, type SubmitEvent } from 'react';

import type { RoomEntryDialogState } from '@/features/room/types/roomEntry';
import { Button } from '@/shared/ui/Button';
import { Dialog } from '@/shared/ui/Dialog';
import { TextField } from '@/shared/ui/TextField';
import { IconNotification } from '@/shared/ui/icons';
import { cn } from '@/shared/utils/cn';

interface RoomEntryDialogProps {
  state: RoomEntryDialogState;
  onClose: () => void;
  onSubscribe: () => void;
  onEnter: () => void;
}

const formatOpensAt = (value: string) => {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value;
  return `${get('day')}일 ${get('hour')}시 ${get('minute')}분부터 입장 가능`;
};

// Figma 570:5908/5909/5910, 802:2744. 버튼은 기존 primary/secondary를 재사용한다.
export const RoomEntryDialog = ({ state, onClose, onSubscribe, onEnter }: RoomEntryDialogProps) => {
  const id = useId();
  const [isInvalid, setIsInvalid] = useState(false);
  const isCode = state.kind === 'code';
  const isFull = state.kind === 'full';
  const isSubscribed = state.kind === 'subscribed';
  const title = isCode
    ? '시청방 초대 코드를 입력해주세요.'
    : isFull
      ? '시청방 정원이 가득 찼어요.'
      : '아직 입장할 수 없는 방이에요.';
  const description = isCode
    ? '비공개 방은 초대 코드가 있어야 입장할 수 있어요.'
    : isFull
      ? '현재 시청방의 입장 가능 인원이 모두 차서 더 이상 입장할 수 없어요.'
      : formatOpensAt(state.opensAt);
  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.kind !== 'code') return;
    const code = new FormData(event.currentTarget).get('entryCode');
    // 길이/문자 정책은 확정하지 않고 fixture와 정확히 비교한다. 없는 코드는 통과시키지 않는다.
    if (!state.expectedCode || code !== state.expectedCode) {
      setIsInvalid(true);
      event.currentTarget.querySelector('input')?.focus();
      return;
    }
    onEnter();
  };

  return (
    <Dialog
      title={title}
      description={description}
      onClose={onClose}
      className={cn(
        'sm:pt-32.75 sm:pb-19.25',
        isCode ? 'sm:pb-17' : isSubscribed ? 'sm:pb-18.5' : 'sm:min-h-117.5',
        (isFull || state.kind === 'subscribe') && 'border-label-neutral',
      )}
      headerClassName={cn('break-keep', !isCode && 'mx-auto w-full max-w-114.25')}
      contentClassName={isFull ? 'gap-12' : state.kind === 'subscribe' ? 'gap-20' : undefined}
    >
      {isCode ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <TextField
            id={id}
            name="entryCode"
            aria-label="초대코드"
            placeholder="초대코드를 입력해주세요."
            required
            data-dialog-autofocus
            aria-invalid={isInvalid}
            onChange={() => setIsInvalid(false)}
            className={cn(isInvalid && 'border-status-negative focus:border-status-negative')}
          />
          <Button type="submit">확인</Button>
        </form>
      ) : isSubscribed ? (
        <>
          <div className="flex items-center gap-4 rounded-large border border-line-strong bg-background-elevated p-6">
            <IconNotification className="size-10 shrink-0 text-accent-engagement-foreground" />
            <div className="flex min-w-0 flex-col gap-2">
              <p className="typo-heading-h4">이미 알림 신청이 완료되었습니다.</p>
              <p className="typo-title-20-regular text-label-neutral">
                입장 가능 시간이 되면 알려드릴게요.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            className="border-accent-engagement-foreground"
            data-dialog-autofocus
            onClick={onClose}
          >
            확인
          </Button>
        </>
      ) : (
        <Button data-dialog-autofocus onClick={isFull ? onClose : onSubscribe}>
          {isFull ? '다른 신청방 둘러보기' : '알림 신청하기'}
        </Button>
      )}
    </Dialog>
  );
};
