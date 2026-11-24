import { type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';

import logoUrl from '@/assets/logo.svg';
import { IconNotification, IconPlus, IconSearch } from '@/shared/ui/icons';

interface NavbarUser {
  nickname: string;
  profileImageUrl?: string;
}

interface NavbarProps {
  /** null이면 로그인 전 상단바(로고, 검색창, 로그인 버튼) */
  user: NavbarUser | null;
  onSearch?: (keyword: string) => void;
}

// Figma GUI > component > top bar (node 491:332)
export const Navbar = ({ user, onSearch }: NavbarProps) => {
  const handleSearchSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = new FormData(event.currentTarget).get('keyword');
    if (typeof keyword === 'string' && keyword.trim()) {
      onSearch?.(keyword.trim());
    }
  };

  const searchForm = (
    <form
      role="search"
      onSubmit={handleSearchSubmit}
      className="ml-35.75 flex w-180 shrink-0 items-center gap-4 rounded-full border border-line-normal bg-background-elevated px-5 py-4 focus-within:border-line-focus"
    >
      <IconSearch className="size-8.5 shrink-0 text-label-normal" />
      <input
        type="search"
        name="keyword"
        aria-label="검색어"
        placeholder="아티스트, 영상, 방 제목을 검색해보세요"
        className="w-full bg-transparent typo-heading-regular text-label-normal outline-none placeholder:text-label-neutral"
      />
    </form>
  );

  return (
    <header className="bg-background-surface">
      <div className="mx-auto flex h-32.5 max-w-480 items-center px-16">
        <Link to="/" aria-label="홈으로 이동" className="shrink-0">
          <img src={logoUrl} alt="COMEBACK ROOM" className="h-20 w-auto" />
        </Link>

        {/* 로그인 여부와 관계없이 검색창은 Figma 기준 x=592 (로고 385 + 간격 143)에 고정 */}
        {searchForm}

        <div className="flex min-w-0 flex-1 items-center justify-end gap-10 pl-10">
          {user ? (
            <>
              <Link
                to="/rooms/new"
                className="flex h-17 shrink-0 items-center gap-2 rounded-medium bg-primary-normal px-5 typo-heading-h4 text-label-normal hover:bg-primary-hover active:bg-primary-pressed"
              >
                <IconPlus className="size-6" />
                시청방 만들기
              </Link>

              <div className="flex min-w-0 items-center gap-12">
                <button type="button" aria-label="알림" className="shrink-0 text-label-strong">
                  <IconNotification className="size-14" />
                </button>

                <Link
                  to="/mypage"
                  title={user.nickname}
                  className="flex min-w-0 items-center gap-5"
                >
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt=""
                      className="size-14 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="size-14 shrink-0 rounded-full bg-gray-200"
                    />
                  )}
                  {/* 남는 폭(1280px 기준 한글 약 3자)을 넘으면 말줄임표로 자른다. 전체 닉네임은 title로 확인 */}
                  <span className="truncate typo-heading-medium text-label-strong">
                    {user.nickname}
                  </span>
                </Link>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="flex h-17 items-center rounded-medium bg-primary-normal px-9 typo-heading-medium text-label-normal hover:bg-primary-hover active:bg-primary-pressed"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
