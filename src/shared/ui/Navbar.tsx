import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';

import logoUrl from '@/assets/logo.svg';
import { IconNotification, IconNotificationAlarm, IconPlus, IconSearch } from '@/shared/ui/icons';
import { RoomSearchDropdown } from '@/features/room/components/RoomSearchDropdown';

interface NavbarUser {
  nickname: string;
  profileImageUrl?: string;
}

interface NavbarProps {
  /** null이면 로그인 전 상단바(로고, 검색창, 로그인 버튼) */
  user: NavbarUser | null;
  onSearch?: (keyword: string) => void;
  /** 알림 버튼이 열 popover 요소의 id */
  notificationPanelId?: string;
  hasUnreadNotification?: boolean;
}

const SEARCH_SUGGESTIONS = [
  '에스파',
  '에스파 컴백',
  '에스파 노래',
  '에스파 카리나',
  '에스파 윈터',
  '에스파 지젤',
  '에스파 닝닝',
  '에스파 안무영상',
];

const SEARCH_HISTORY_KEY = 'comeback-room-search-history';

// Figma GUI > component > top bar (node 491:332)
export const Navbar = ({
  user,
  onSearch,
  notificationPanelId,
  hasUnreadNotification = false,
}: NavbarProps) => {
  const [keyword, setKeyword] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  const isRecent = keyword.trim() === '';

  const displayedKeywords = isRecent
    ? recentSearches
    : SEARCH_SUGGESTIONS.filter((item) =>
        item.toLowerCase().includes(keyword.trim().toLowerCase()),
      );

  const executeSearch = (value: string) => {
    const trimmedKeyword = value.trim();

    if (!trimmedKeyword) return;

    const updatedSearches = [
      trimmedKeyword,
      ...recentSearches.filter((item) => item !== trimmedKeyword),
    ].slice(0, 8);

    setRecentSearches(updatedSearches);
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedSearches));

    setKeyword(trimmedKeyword);
    setIsSearchOpen(false);

    onSearch?.(trimmedKeyword);
  };

  const handleSearchSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    executeSearch(keyword);
  };

  const searchForm = (
    <div
      className="relative ml-35.75 w-180 shrink-0"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsSearchOpen(false);
        }
      }}
    >
      <form
        role="search"
        onSubmit={handleSearchSubmit}
        className="flex w-full items-center gap-4 rounded-full border border-line-normal bg-background-elevated px-5 py-4 focus-within:border-line-focus"
      >
        <IconSearch className="size-8.5 shrink-0 text-label-normal" />

        <input
          type="search"
          name="keyword"
          aria-label="검색어"
          value={keyword}
          autoComplete="off"
          onFocus={() => setIsSearchOpen(true)}
          onClick={() => setIsSearchOpen(true)}
          onChange={(event) => {
            setKeyword(event.target.value);
            setIsSearchOpen(true);
          }}
          placeholder="아티스트, 영상, 방 제목을 검색해보세요"
          className="w-full bg-transparent typo-heading-regular text-label-normal outline-none placeholder:text-label-neutral"
        />
      </form>

      {isSearchOpen && (
        <RoomSearchDropdown
          keywords={displayedKeywords}
          isRecent={isRecent}
          onSelect={executeSearch}
        />
      )}
    </div>
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
                <button
                  type="button"
                  aria-label={hasUnreadNotification ? '알림, 읽지 않은 알림 있음' : '알림'}
                  popoverTarget={notificationPanelId}
                  className="shrink-0 rounded-small text-label-strong focus-visible:outline-2 focus-visible:outline-line-focus"
                >
                  {hasUnreadNotification ? (
                    <IconNotificationAlarm className="size-14" />
                  ) : (
                    <IconNotification className="size-14" />
                  )}
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
