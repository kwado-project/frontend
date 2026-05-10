import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/lib/types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (data: { user: User; accessToken: string; refreshToken: string }) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      setAuth: (data) =>
        set({
          user: data.user,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        }),
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("devVerificationToken");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "kwado-auth",
    }
  )
);
