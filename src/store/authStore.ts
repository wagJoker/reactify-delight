/**
 * @module store/authStore
 * @description Zustand store для управления аутентификацией.
 * Следует SRP — отвечает только за состояние авторизации.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser } from "@/types/user";

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: IUser, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) =>
        set({ user, token, isAuthenticated: true }),
      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: "auth-storage" }
  )
);
