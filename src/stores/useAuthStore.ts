import { create } from 'zustand';

// Access Token은 XSS 노출을 줄이려고 메모리에만 둔다. 새로고침 후에는 /auth/refresh로 복구한다.
interface AuthState {
  accessToken: string | null;
  isLoggedIn: boolean;
  setAccessToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  isLoggedIn: false,
  setAccessToken: (token) => set({ accessToken: token, isLoggedIn: token !== null }),
}));
