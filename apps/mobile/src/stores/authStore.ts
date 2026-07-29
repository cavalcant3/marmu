import { create } from "zustand";
import { MMKV } from "../utils/storage";

const storage = new MMKV({
  id: "marmu-auth",
  encrypt: true,
});

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: { id: string; email: string; nome: string } | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: { id: string; email: string; nome: string }) => void;
  logout: () => void;
  loadTokens: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,

  setTokens: (access, refresh) => {
    storage.set("accessToken", access);
    storage.set("refreshToken", refresh);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },

  setUser: (user) => {
    storage.set("user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    storage.delete("accessToken");
    storage.delete("refreshToken");
    storage.delete("user");
    set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
  },

  loadTokens: () => {
    const access = storage.getString("accessToken");
    const refresh = storage.getString("refreshToken");
    const userStr = storage.getString("user");
    if (access && refresh) {
      set({
        accessToken: access,
        refreshToken: refresh,
        isAuthenticated: true,
        user: userStr ? JSON.parse(userStr) : null,
      });
    }
  },
}));
