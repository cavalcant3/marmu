import { create } from "zustand";
import { MMKV } from "../utils/storage";

const storage = new MMKV({
  id: "marmu-auth",
  encrypt: true,
});

export interface UserProfile {
  id: string;
  email: string;
  nome: string;
  nome_marmoaria?: string;
  telefone?: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: UserProfile) => void;
  updateUser: (updates: Partial<UserProfile>) => void;
  logout: () => void;
  loadTokens: () => void;
}

const DEFAULT_USER: UserProfile = {
  id: "1",
  email: "contato@marmoaria.com",
  nome: "Minha Marmoaria",
  nome_marmoaria: "Marmoaria Marmu",
  telefone: "(11) 99999-9999",
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: "local-demo-access-token",
  refreshToken: "local-demo-refresh-token",
  user: DEFAULT_USER,
  isAuthenticated: true,

  setTokens: (access, refresh) => {
    storage.set("accessToken", access);
    storage.set("refreshToken", refresh);
    set({ accessToken: access, refreshToken: refresh, isAuthenticated: true });
  },

  setUser: (user) => {
    storage.set("user", JSON.stringify(user));
    set({ user });
  },

  updateUser: (updates) => {
    const current = get().user || DEFAULT_USER;
    const updated = { ...current, ...updates };
    storage.set("user", JSON.stringify(updated));
    set({ user: updated });
  },

  logout: () => {
    storage.delete("accessToken");
    storage.delete("refreshToken");
    storage.delete("user");
    set({ accessToken: "local-demo-access-token", refreshToken: "local-demo-refresh-token", user: DEFAULT_USER, isAuthenticated: true });
  },

  loadTokens: () => {
    const userStr = storage.getString("user");
    if (userStr) {
      try {
        set({ user: JSON.parse(userStr), isAuthenticated: true });
      } catch {
        set({ user: DEFAULT_USER, isAuthenticated: true });
      }
    } else {
      set({ user: DEFAULT_USER, isAuthenticated: true });
    }
  },
}));


