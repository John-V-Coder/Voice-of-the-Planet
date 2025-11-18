import { create } from 'zustand';
import authService from '../services/authService';

const useAuthStore = create((set, get) => ({
  user: authService.getStoredUser(),
  token: authService.getStoredToken(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,

  requestAdminCode: async (email) => {
    set({ loading: true, error: null });
    const result = await authService.requestAdminLoginCode(email);
    set({ loading: false, error: result.success ? null : result.message });
    return result;
  },

  verifyAdminCode: async (email, code) => {
    set({ loading: true, error: null });
    const result = await authService.verifyAdminLoginCode(email, code);
    if (result.success) {
      set({
        user: result.data,
        token: result.token,
        isAuthenticated: true,
        loading: false,
        error: null,
      });
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  checkAuth: async () => {
    const result = await authService.checkAuth();
    if (result.success) {
      set({ user: result.user, isAuthenticated: true });
    } else {
      set({ user: null, token: null, isAuthenticated: false });
    }
    return result;
  },

  logout: () => {
    authService.logout();
    set({ user: null, token: null, isAuthenticated: false, error: null });
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
