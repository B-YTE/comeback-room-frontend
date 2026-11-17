import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import './index.css';
import { refreshAccessToken } from '@/features/auth/api/auth';
import { useAuthStore } from '@/stores/useAuthStore';

const queryClient = new QueryClient();

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import('./mocks/browser');

  return worker.start({
    onUnhandledFrame: 'bypass',
  });
}

// 새로고침하면 메모리의 토큰이 사라지므로 렌더 전에 복구한다. 쿠키가 없거나 만료되면 비로그인으로 시작한다.
async function restoreSession() {
  localStorage.removeItem('accessToken'); // 이전 방식으로 저장된 토큰 정리
  try {
    useAuthStore.getState().setAccessToken(await refreshAccessToken());
  } catch {
    // 401 등은 비로그인 상태로 두면 된다
  }
}

enableMocking()
  .then(restoreSession)
  .then(() => {
    createRoot(document.getElementById('root')!).render(
      <StrictMode>
        <BrowserRouter>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </BrowserRouter>
      </StrictMode>,
    );
  });
