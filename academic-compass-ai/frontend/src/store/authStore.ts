import { create } from "zustand";
import type { UserSummary } from "../types";

interface AuthState {
  accessToken: string | null;
  user: UserSummary | null;
  setAuth: (token: string, user: UserSummary) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  setAuth: (accessToken, user) => set({ accessToken, user }),
  clearAuth: () => set({ accessToken: null, user: null }),
}));
