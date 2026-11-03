import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '@/stores/useAuthStore';

// 로그인한 유저는 로그인·회원가입 같은 비로그인 전용 화면 대신 홈으로 보낸다.
export const GuestOnlyRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return isLoggedIn ? <Navigate to="/" replace /> : <Outlet />;
};
