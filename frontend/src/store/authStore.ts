import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface IUser {
  id: number;
  email: string;
  name: string | null;
}

export interface IAuthState {
  isAuthenticated: boolean;
  user: IUser | null;
  token: string | null;
  login: (user: IUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<IAuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      login: (user, token) =>
        set({ isAuthenticated: true, user, token }),
      logout: () =>
        set({ isAuthenticated: false, user: null, token: null }),
    }),
    {
      name: 'auth-storage', // nama key di localStorage
    }
  )
);
