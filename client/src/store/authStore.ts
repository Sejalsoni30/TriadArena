import { create } from 'zustand';
import { UserProfile } from '@triad-arena/shared';

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: UserProfile) => void;
  logout: () => void;
  updateUser: (updates: Partial<UserProfile>) => void;
}

const STORAGE_KEY_USER = 'triad_user';
const STORAGE_KEY_TOKEN = 'triad_token';

// Initial state from localStorage if available
const savedUser = localStorage.getItem(STORAGE_KEY_USER);
const savedToken = localStorage.getItem(STORAGE_KEY_TOKEN);

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
  isLoading: false,
  login: (token, user) => {
    localStorage.setItem(STORAGE_KEY_TOKEN, token);
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    set({ token, user, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    set({ token: null, user: null, isAuthenticated: false });
  },
  updateUser: (updates) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...updates };
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updated));
      return { user: updated };
    });
  }
}));
