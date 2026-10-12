import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthUser } from '../shared/types/auth';
import { resetGuestAddressesStore } from './guest-addresses.store';

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  setAuth: (accessToken: string, user: AuthUser) => void;
  updateUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      setAuth: (accessToken, user) => set({ accessToken, user }),
      updateUser: (user) => set({ user }),
      logout: () => {
        resetGuestAddressesStore();
        set({ accessToken: null, user: null });
      },
    }),
    {
      name: 'svels-auth',
      skipHydration: true,
    },
  ),
);
