import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { NotificationPanel } from '@/features/notification/components/NotificationPanel';
import { notifications as sampleNotifications } from '@/mocks/notifications';
import { Navbar } from '@/shared/ui/Navbar';
import { useAuthStore } from '@/stores/useAuthStore';

// 로그인 유저 정보(닉네임, 프로필 이미지)는 인증 방식이 확정되면 스토어에서 받아 넘긴다.
const GUEST_NICKNAME = '사용자';
const NOTIFICATION_PANEL_ID = 'notification-panel';

export const AppLayout = () => {
  const navigate = useNavigate();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  // shortcut: 알림 API·실시간 연동 전이라 목업을 로컬 상태로 둔다, API 확정 시 TanStack Query로 바꾼다.
  const [notifications, setNotifications] = useState(sampleNotifications);
  const handleReadAll = () =>
    setNotifications((current) =>
      current.map((notification) => ({ ...notification, isRead: true })),
    );

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        user={isLoggedIn ? { nickname: GUEST_NICKNAME } : null}
        onSearch={(keyword) => navigate(`/?keyword=${encodeURIComponent(keyword)}`)}
        notificationPanelId={NOTIFICATION_PANEL_ID}
        hasUnreadNotification={notifications.some((notification) => !notification.isRead)}
      />
      {isLoggedIn && (
        <NotificationPanel
          id={NOTIFICATION_PANEL_ID}
          notifications={notifications}
          onReadAll={handleReadAll}
        />
      )}
      <main className="mx-auto flex w-full max-w-480 flex-1 flex-col px-16">
        <Outlet />
      </main>
    </div>
  );
};
