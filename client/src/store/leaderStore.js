import { create } from 'zustand';
import leaderService from '../services/leaderService';

const useLeaderStore = create((set) => ({
  leaders: [],
  currentLeader: null,
  loading: false,
  error: null,

  registerLeader: async (leaderData) => {
    set({ loading: true, error: null });
    const result = await leaderService.registerLeader(leaderData);
    set({ loading: false, error: result.success ? null : result.message });
    return result;
  },

  verifyEmail: async (email, code) => {
    set({ loading: true, error: null });
    const result = await leaderService.verifyEmail(email, code);
    set({ loading: false, error: result.success ? null : result.message });
    return result;
  },

  getLeaderById: async (id) => {
    set({ loading: true, error: null });
    const result = await leaderService.getLeaderById(id);
    if (result.success) {
      set({ currentLeader: result.data, loading: false, error: null });
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  updateLeader: async (id, updateData) => {
    set({ loading: true, error: null });
    const result = await leaderService.updateLeader(id, updateData);
    if (result.success) {
      set({ currentLeader: result.data, loading: false, error: null });
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  updateLeaderScore: async (id, scoreData) => {
    set({ loading: true, error: null });
    const result = await leaderService.updateLeaderScore(id, scoreData);
    set({ loading: false, error: result.success ? null : result.message });
    return result;
  },

  clearError: () => set({ error: null }),
}));

export default useLeaderStore;
