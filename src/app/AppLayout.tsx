import { Outlet } from 'react-router-dom';

import { Navbar } from '@/shared/ui/Navbar';
import { useAuthStore } from '@/stores/useAuthStore';

// 로그인 유저 정보(닉네임, 프로필 이미지)는 인증 방식이 확정되면 스토어에서 받아 넘긴다.
const GUEST_NICKNAME = '사용자';

export const AppLayout = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar user={isLoggedIn ? { nickname: GUEST_NICKNAME } : null} />
      <main className="mx-auto flex w-full max-w-480 flex-1 flex-col px-16">
        <Outlet />
      </main>
    </div>
  );
};
