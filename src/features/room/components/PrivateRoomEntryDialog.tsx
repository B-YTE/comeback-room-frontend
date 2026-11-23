import { useId, useState, type SubmitEvent } from 'react';

import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';

interface PrivateRoomEntryDialogProps {
  onClose: () => void;
  onEnter: (code: string) => void;
  isPending?: boolean;
  error?: string;
}

export const PrivateRoomEntryDialog = ({
  onClose,
  onEnter,
  isPending = false,
  error = '',
}: PrivateRoomEntryDialogProps) => {
  const inputId = useId();
  const [entryCode, setEntryCode] = useState('');
  const [isInvalid, setIsInvalid] = useState(false);

  const hasError = isInvalid || Boolean(error);

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!/^\d{4,10}$/.test(entryCode)) {
      setIsInvalid(true);
      return;
    }

    setIsInvalid(false);
    onEnter(entryCode);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="private-room-dialog-title"
        className="relative w-full max-w-[420px] rounded-[12px] border border-[#52515B] px-12 pt-14 pb-12 shadow-xl"
        style={{ backgroundColor: '#222127' }}
      >
        {/* 닫기 버튼 */}
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-label-neutral hover:text-label-strong"
        >
          ×
        </button>

        {/* 자물쇠 아이콘 */}
        <div className="mb-5 flex justify-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="text-primary-normal"
          >
            <rect
              x="5"
              y="10"
              width="14"
              height="12"
              rx="2"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M8 10V7a4 4 0 0 1 8 0v3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* 제목과 설명 */}
        <div className="mb-10 text-center">
          <h2
            id="private-room-dialog-title"
            className="text-[26px] font-bold leading-[36px] text-label-strong"
          >
            비공개방 입장
          </h2>
          <p className="mt-3 text-[15px] font-normal text-label-neutral">
            입장 코드를 입력해주세요.
          </p>
        </div>

        {/* 입장 코드 입력 */}
        <form onSubmit={handleSubmit}>
          <TextField
            id={inputId}
            type="text"
            inputMode="numeric"
            autoComplete="off"
            placeholder="코드를 입력해주세요."
            aria-label="입장 코드"
            aria-invalid={hasError}
            value={entryCode}
            maxLength={10}
            onChange={(event) => {
              setEntryCode(event.target.value.replace(/\D/g, ''));
              setIsInvalid(false);
            }}
            className={`text-sm ${
              hasError ? 'border-status-negative focus:border-status-negative' : ''
            }`}
          />

          {/* 오류 메시지 */}
          {hasError && (
            <p role="alert" className="mt-2 text-xs text-status-negative">
              {error || '입장 코드가 일치하지 않아요.'}
            </p>
          )}

          {/* 하단 버튼 */}
          <div className="mt-7 flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
              취소
            </Button>

            <Button type="submit" variant="primary" disabled={isPending} className="flex-1">
              {isPending ? '확인 중...' : '입장하기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
