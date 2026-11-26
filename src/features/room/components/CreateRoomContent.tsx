import { useState } from 'react';

import previewImage from '@/assets/home/popular-1.png';
import globeIcon from '@/assets/home/globe.svg';
import lockIcon from '@/assets/home/lock.svg';

import calendarIcon from '@/assets/home/calendar.svg';
import clockIcon from '@/assets/home/clock.svg';
import peopleIcon from '@/assets/home/people.svg';

import { TextField } from '@/shared/ui/TextField';
import { Button } from '@/shared/ui/Button';
import { ConfirmDialog } from '@/shared/ui/ConfirmDialog';

type RoomVisibility = 'public' | 'private';

export const CreateRoomContent = () => {
  const [title, setTitle] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState<RoomVisibility>('public');
  const [inviteCode, setInviteCode] = useState('');
  const [capacity, setCapacity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('21:00');
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const isPrivate = visibility === 'private';

  const addTag = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();

    const value = tagInput.trim();

    if (value && tags.length < 10 && !tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput('');
  };

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isPrivate && !/^\d{4,10}$/.test(inviteCode)) {
      alert('초대 코드는 4~10자리 숫자로 입력해주세요.');
      return;
    }

    // TODO: 백엔드 시청방 생성 API 연결
    alert('UI 구현 단계입니다. 실제 시청방은 아직 생성되지 않습니다.');
  };

  return (
    <main className="w-full pt-12 pb-24 text-label-strong">
      <div className="w-full">
        <header className="mb-8">
          <h1 className="typo-heading-semibold-36">시청방 만들기</h1>
          <p className="mt-2 typo-body-medium text-label-neutral">
            방 정보를 입력하고 나만의 시청방을 만들어보세요.
          </p>
        </header>

        <form
          id="create-room-form"
          onSubmit={handleSubmit}
          className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-20"
        >
          {/* 왼쪽: 방 정보 입력 */}
          <div className="flex flex-col gap-7">
            <div>
              <label htmlFor="room-title" className="mb-3 block font-medium">
                방제목
              </label>

              <div className="relative">
                <TextField
                  id="room-title"
                  placeholder="방제목을 입력해주세요."
                  maxLength={50}
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="pr-16"
                />

                <span className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 typo-caption text-label-assistive">
                  {title.length}/50
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="youtube-url" className="mb-3 block font-medium">
                Youtube 영상 URL
              </label>

              <TextField
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                required
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="room-tag" className="mb-3 block font-medium">
                태그
                <span className="ml-1 text-sm text-label-assistive">(최대 10개)</span>
              </label>
              <TextField
                id="room-tag"
                placeholder="태그를 입력하고 Enter를 눌러 추가하세요. (예. 카리나)"
                value={tagInput}
                disabled={tags.length >= 10}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
              />
              <div className="mt-3 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    className="rounded-full bg-background-subtle px-4 py-2 text-sm text-label-neutral"
                    onClick={() => setTags((prev) => prev.filter((item) => item !== tag))}
                  >
                    {tag} <span className="ml-2">×</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 공개 / 비공개 선택 */}
            <div>
              <p className="mb-3 font-medium">공개 범위</p>

              <div className="grid grid-cols-2 gap-5">
                <button
                  type="button"
                  aria-pressed={!isPrivate}
                  onClick={() => setVisibility('public')}
                  className={`flex min-h-[78px] items-center gap-4 rounded-[8px] border px-6 py-4 text-left ${
                    !isPrivate ? 'border-[#FF3278]' : 'border-line-normal'
                  }`}
                >
                  <img src={globeIcon} alt="" className="size-8 shrink-0" />
                  <span>
                    <strong className="block text-base font-medium">공개방</strong>
                    <span className="text-sm text-label-assistive">
                      목록에 노출되어 누구나 입장 가능
                    </span>
                  </span>
                </button>

                <button
                  type="button"
                  aria-pressed={isPrivate}
                  onClick={() => setVisibility('private')}
                  className={`flex min-h-[78px] items-center gap-4 rounded-[8px] border px-6 py-4 text-left ${
                    isPrivate ? 'border-[#FF3278]' : 'border-line-normal'
                  }`}
                >
                  <img src={lockIcon} alt="" className="size-8 shrink-0" />
                  <span>
                    <strong className="block text-base font-medium">비공개방</strong>
                    <span className="text-sm text-label-assistive">
                      목록에 노출되지 않아 누구나 입장 불가능
                    </span>
                  </span>
                </button>
              </div>
            </div>

            {/* 비공개방 선택 시 추가 입력 */}
            {isPrivate && (
              <div>
                <label htmlFor="invite-code" className="mb-3 block font-medium">
                  초대 코드
                  <span className="ml-1 text-sm text-label-assistive">(숫자만 입력)</span>
                </label>
                <TextField
                  id="invite-code"
                  placeholder="4~10자리 숫자를 입력해주세요."
                  value={inviteCode}
                  required
                  type="text"
                  inputMode="numeric"
                  minLength={4}
                  maxLength={10}
                  pattern="[0-9]{4,10}"
                  onChange={(e) => setInviteCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>
            )}

            {/* 참여 인원 / 시작 시간 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="capacity" className="mb-3 block font-medium">
                  최대 참여 인원
                </label>
                <TextField
                  id="capacity"
                  type="number"
                  min={1}
                  required
                  placeholder="예: 500명"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                />
              </div>

              <div>
                <div>
                  <label className="mb-3 block font-medium">시작 시간</label>
                  <div className="grid grid-cols-[1.8fr_1fr] gap-3">
                    {/* 날짜 입력 */}
                    <div className="relative flex h-14 min-w-0 items-center gap-3 rounded-medium border border-line-normal px-4 focus-within:border-primary-normal">
                      <img src={calendarIcon} alt="" className="size-6 shrink-0" />

                      <span className="whitespace-nowrap text-sm text-label-neutral">
                        {startDate
                          ? `${startDate.replaceAll('-', '.')} (${new Date(`${startDate}T00:00:00`).toLocaleDateString('ko-KR', { weekday: 'short' })})`
                          : 'YYYY.MM.DD (토)'}
                      </span>

                      <input
                        type="date"
                        aria-label="시작 날짜"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full"
                        value={startDate}
                        required
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>

                    {/* 시간 입력 */}
                    <div className="relative flex h-14 min-w-0 items-center gap-3 rounded-medium border border-line-normal px-4 focus-within:border-primary-normal">
                      <img src={clockIcon} alt="" className="size-6 shrink-0" />

                      <span className="text-sm text-label-neutral">{startTime}</span>

                      <input
                        type="time"
                        aria-label="시작 시각"
                        className="absolute inset-0 h-full w-full cursor-pointer opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full"
                        value={startTime}
                        required
                        onChange={(e) => setStartTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 미리보기 */}
          <div className="flex flex-col gap-10">
            <aside className="rounded-xl bg-background-surface p-6">
              <h2 className="font-semibold">미리보기</h2>
              <p className="mt-2 mb-5 text-sm text-label-assistive">
                입력한 정보로 시청방이 이렇게 보여요.
              </p>

              <img
                src={previewImage}
                alt="시청방 썸네일"
                className="aspect-video w-full rounded-md object-cover"
              />

              <div className="mt-4">
                <div className="flex flex-wrap items-center gap-3">
                  <strong className="text-sm">{title || '같이 봐요'}</strong>
                  <span className="text-xs text-label-assistive">방장 @nickname</span>
                </div>
                <p className="mt-1 text-xs text-label-neutral">
                  aespa · [ae:scenes] 사진을 부르는 비주얼
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {(tags.length ? tags : ['아이브', '뮤비', '컴백']).slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-background-subtle px-3 py-2 text-xs text-label-neutral"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-4 border-b border-line-subtle pb-4 text-[13px] text-label-neutral">
                <span className="flex items-center gap-2">
                  <img src={calendarIcon} alt="" className="size-5 shrink-0 -translate-y-[2px]" />
                  {startDate
                    ? `${startDate.replaceAll('-', '. ')} (${new Date(`${startDate}T00:00:00`).toLocaleDateString('ko-KR', { weekday: 'short' })})`
                    : '2026. 09. 20 (일)'}{' '}
                  {startTime}
                </span>

                <span className="flex items-center gap-2">
                  <img src={peopleIcon} alt="" className="size-5 shrink-0 -translate-y-[1px]" />
                  최대 {capacity || '500'}명
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <img src={isPrivate ? lockIcon : globeIcon} alt="" className="size-9 shrink-0" />
                <div>
                  <strong className="block text-sm">{isPrivate ? '비공개방' : '공개방'}</strong>
                  <p className="mt-1 text-xs text-label-assistive">
                    {isPrivate ? '초대 코드로 입장 가능' : '목록에 노출되어 누구나 입장 가능'}
                  </p>
                </div>
              </div>
            </aside>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCancelOpen(true)}
                className="flex-1"
              >
                취소
              </Button>

              <Button
                type="submit"
                form="create-room-form"
                variant="primary"
                className="flex-[1.5]"
              >
                방 만들기
              </Button>
            </div>
          </div>
        </form>
      </div>

      {isCancelOpen && (
        <ConfirmDialog
          title="작성중인 내용이 사라져요."
          description="나가시겠습니까?"
          confirmLabel="나가기"
          onClose={() => setIsCancelOpen(false)}
          onConfirm={() => window.history.back()}
        />
      )}
    </main>
  );
};
