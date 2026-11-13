import { Link } from 'react-router-dom';

import arrowUrl from '@/assets/mypage/arrow.svg';
import editUrl from '@/assets/mypage/edit.svg';
import { Button } from '@/shared/ui/Button';
import { TextField } from '@/shared/ui/TextField';
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

// Figma GUI > 마이페이지 (333:603). 계정 API 확정 전에는 개인 데이터를 표시하지 않는다.
export const MyPageContent = () => {
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
                <IconMyStroke className="size-20 text-label-neutral" aria-hidden="true" />
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
                  placeholder="사용자 정보 연동 준비 중"
                  disabled
                  aria-describedby="nickname-help mypage-notice"
                  className="h-15 min-w-0 flex-1 typo-heading-regular"
                />
                <Button disabled variant="secondary" className="h-15 w-full shrink-0 sm:w-42.5">
                  닉네임 수정
                </Button>
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
          {isLoggedIn
            ? '계정 기능을 준비 중입니다.'
            : '로그인 및 사용자 정보 연동을 준비 중입니다.'}
        </p>
      </div>
    </div>
  );
};
