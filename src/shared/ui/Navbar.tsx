import { type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';

import logoUrl from '@/assets/logo.svg';
import { IconNotification, IconPlus, IconSearch } from '@/shared/ui/icons';

interface NavbarUser {
  nickname: string;
  profileImageUrl?: string;
}

interface NavbarProps {
  /** null이면 로그인 전 상단바(로고만 표시) */
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

  return (
    <header className="bg-background-surface">
      <div className="mx-auto flex h-32.5 max-w-480 items-center justify-between px-16">
        <Link to="/" aria-label="홈으로 이동">
          <img src={logoUrl} alt="COMEBACK ROOM" className="h-20 w-auto" />
        </Link>

        {user && (
          <div className="flex items-center gap-10">
            <form
              role="search"
              onSubmit={handleSearchSubmit}
              className="flex w-180 items-center gap-4 rounded-full border border-line-normal bg-background-elevated px-5 py-4 focus-within:border-line-focus"
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

            <Link
              to="/rooms/new"
              className="flex h-17 items-center gap-2 rounded-medium bg-primary-normal px-5 typo-heading-h4 text-label-normal hover:bg-primary-hover active:bg-primary-pressed"
            >
              <IconPlus className="size-6" />
              시청방 만들기
            </Link>

            <div className="flex items-center gap-12">
              <button type="button" aria-label="알림" className="text-label-strong">
                <IconNotification className="size-14" />
              </button>

              <Link to="/mypage" className="flex items-center gap-5">
                {user.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt=""
                    className="size-14 rounded-full object-cover"
                  />
                ) : (
                  <span aria-hidden="true" className="size-14 rounded-full bg-gray-200" />
                )}
                <span className="typo-heading-medium text-label-strong">{user.nickname}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
