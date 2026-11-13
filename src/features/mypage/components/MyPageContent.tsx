import { useState } from 'react';
import { isAxiosError } from 'axios';
import { useProfile } from '@/features/mypage/hooks/useProfile';
import { getErrorMessage } from '@/shared/api/getErrorMessage';
import { Link } from 'react-router-dom';

import arrowUrl from '@/assets/mypage/arrow.svg';
import editUrl from '@/assets/mypage/edit.svg';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
import { TextFieldButton } from '@/shared/ui/TextFieldButton';
import { IconMyStroke } from '@/shared/ui/icons';
import { cn } from '@/shared/utils/cn';
import { useAuthStore } from '@/stores/useAuthStore';

const NAVIGATION_ITEMS = [
  {
    title: '내 시청 목록',
    description: '지금까지 시청한 시청방을 확인해보세요.',
    to: '/mypage/viewing-list',
  },
  {
    title: '내가 만든 시청방',
    description: '내가 만든 시청방을 확인해보세요.',
    to: '/mypage/created-rooms',
  },
];

const SECTION_CLASS_NAME =
  'flex flex-col gap-10 rounded-extralarge border border-line-focus bg-background-surface p-6';

// Figma GUI > 마이페이지 (333:603). 프로필 API는 개발용 MSW를 사용한다.
export const MyPageContent = () => {
  const { profile, nickname } = useProfile();
  const [draft, setDraft] = useState<string | null>(null);
  const value = draft ?? profile.data?.nickname ?? '';
  const valid = /^[가-힣a-zA-Z0-9]{2,10}$/.test(value);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="mx-auto mt-17.5 mb-17 flex w-full max-w-235 flex-col gap-16">
      <header className="flex flex-col items-center gap-2 text-center">
        <h1 className="typo-display-medium">마이 페이지</h1>
        <p className="typo-heading-h4 text-label-neutral">내 정보를 확인하고 관리할 수 있습니다.</p>
      </header>

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2" aria-describedby="mypage-notice">
          {NAVIGATION_ITEMS.map(({ title, description, to }) => {
            const content = (
              <>
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="typo-heading-h3">{title}</span>
                  <span className="typo-title-20-regular text-label-neutral">{description}</span>
                </span>
                <img src={arrowUrl} alt="" className="shrink-0" />
              </>
            );
            const className =
              'flex min-w-0 items-center justify-between gap-3 rounded-extralarge border border-line-focus bg-background-surface p-5 text-left hover:bg-interaction-selected focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-line-focus';
            return to ? (
              <Link key={title} to={to} className={className}>
                {content}
              </Link>
            ) : (
              <button key={title} type="button" disabled className={className}>
                {content}
              </button>
            );
          })}
        </div>

        <section className={cn(SECTION_CLASS_NAME, 'pb-16')} aria-labelledby="profile-title">
          <h2 id="profile-title" className="border-b border-line-normal px-6 py-3 typo-heading-h1">
            프로필
          </h2>
          <div className="flex flex-col items-center gap-8 px-4 sm:flex-row sm:gap-16 sm:px-8">
            <div className="relative shrink-0">
              <div className="flex size-45 items-center justify-center rounded-full bg-background-elevated">
                {profile.data?.profileImageUrl ? (
                  <img
                    src={profile.data.profileImageUrl}
                    alt="프로필"
                    className="size-full rounded-full object-cover"
                  />
                ) : (
                  <IconMyStroke className="size-20 text-label-neutral" aria-hidden="true" />
                )}
              </div>
              <button
                type="button"
                disabled
                aria-label="프로필 이미지 변경 (준비 중)"
                aria-describedby="mypage-notice"
                className="absolute right-1 bottom-0"
              >
                <img src={editUrl} alt="" />
              </button>
            </div>
            <div className="flex w-full min-w-0 flex-col gap-3">
              <label htmlFor="mypage-nickname" className="typo-heading-h3">
                닉네임
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <TextField
                  id="mypage-nickname"
                  placeholder={profile.isPending ? '불러오는 중' : '닉네임'}
                  value={value}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    nickname.reset();
                  }}
                  disabled={!profile.data || nickname.isPending}
                  aria-describedby="nickname-help mypage-notice"
                  className="h-15 min-w-0 flex-1 typo-heading-regular"
                />
                <TextFieldButton
                  disabled={
                    !profile.data || !valid || nickname.isPending || value === profile.data.nickname
                  }
                  onClick={() => {
                    if (valid && !nickname.isPending)
                      nickname.mutate({ nickname: value }, { onSuccess: () => setDraft(null) });
                  }}
                  className="h-15 w-full disabled:bg-label-normal disabled:text-background-base sm:w-42.5"
                >
                  닉네임 수정
                </TextFieldButton>
              </div>
              <p id="nickname-help" className="typo-title-20-regular text-label-neutral">
                2-10자의 한글, 영문, 숫자를 사용할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        <section className={cn(SECTION_CLASS_NAME, 'pb-12')} aria-labelledby="account-title">
          <h2 id="account-title" className="border-b border-line-normal px-6 py-3 typo-heading-h1">
            계정
          </h2>
          <div
            className="mx-auto flex w-full max-w-134.5 flex-col gap-4"
            aria-describedby="mypage-notice"
          >
            {/* API 준비 전 비활성 동작을 유지하되 Figma의 계정 버튼 색상을 표시한다. */}
            <Button disabled className="disabled:bg-primary-normal disabled:text-label-strong">
              로그아웃
            </Button>
            <Button
              disabled
              variant="secondary"
              className="disabled:bg-background-elevated disabled:text-label-normal"
            >
              회원 탈퇴
            </Button>
          </div>
        </section>

        <p
          id="mypage-notice"
          role="status"
          className="text-center typo-body-medium text-label-neutral"
        >
          {profile.isPending
            ? '프로필을 불러오는 중입니다.'
            : profile.isError
              ? profile.error instanceof Error && !isAxiosError(profile.error)
                ? profile.error.message
                : getErrorMessage(profile.error)
              : nickname.isError
                ? getErrorMessage(nickname.error)
                : nickname.isSuccess
                  ? '닉네임이 수정되었습니다. 개발용 변경은 서버에 저장되지 않습니다.'
                  : import.meta.env.DEV
                    ? '개발용 예시 프로필입니다. 변경 사항은 실제 서버에 저장되지 않습니다.'
                    : isLoggedIn
                      ? '계정 기능을 준비 중입니다.'
                      : '로그인이 필요합니다.'}
          {profile.isError && (
            <button type="button" onClick={() => void profile.refetch()}>
              다시 시도
            </button>
          )}
        </p>
      </div>
    </div>
  );
};
