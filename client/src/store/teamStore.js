import { create } from 'zustand';
import teamService from '../services/teamService';

const useTeamStore = create((set) => ({
  teams: [],
  currentTeam: null,
  teamMembers: [],
  loading: false,
  error: null,

  createTeam: async (teamData) => {
    set({ loading: true, error: null });
    const result = await teamService.createTeam(teamData);
    if (result.success) {
      set((state) => ({
        teams: [...state.teams, result.data],
        loading: false,
        error: null,
      }));
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  joinTeamByCode: async (leaderId, uniqueTeamCode) => {
    set({ loading: true, error: null });
    const result = await teamService.joinTeamByCode(leaderId, uniqueTeamCode);
    set({ loading: false, error: result.success ? null : result.message });
    return result;
  },

  getTeamMembers: async (teamId) => {
    set({ loading: true, error: null });
    const result = await teamService.getTeamMembers(teamId);
    if (result.success) {
      set({ teamMembers: result.data, loading: false, error: null });
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  sendTeamInvite: async (teamId, inviteeEmail, inviterName) => {
    set({ loading: true, error: null });
    const result = await teamService.sendTeamInvite(teamId, inviteeEmail, inviterName);
    set({ loading: false, error: result.success ? null : result.message });
    return result;
  },

  clearError: () => set({ error: null }),
}));

export default useTeamStore;
