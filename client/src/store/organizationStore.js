import { create } from 'zustand';
import organizationService from '../services/organizationService';

const useOrganizationStore = create((set) => ({
  organizations: [],
  currentOrganization: null,
  loading: false,
  error: null,

  createOrganization: async (orgData) => {
    set({ loading: true, error: null });
    const result = await organizationService.createOrganization(orgData);
    if (result.success) {
      set((state) => ({
        organizations: [...state.organizations, result.data],
        loading: false,
        error: null,
      }));
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  getAllOrganizations: async () => {
    set({ loading: true, error: null });
    const result = await organizationService.getAllOrganizations();
    if (result.success) {
      set({ organizations: result.data, loading: false, error: null });
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  getOrganizationById: async (id) => {
    set({ loading: true, error: null });
    const result = await organizationService.getOrganizationById(id);
    if (result.success) {
      set({ currentOrganization: result.data, loading: false, error: null });
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  updateOrganization: async (id, updateData) => {
    set({ loading: true, error: null });
    const result = await organizationService.updateOrganization(id, updateData);
    if (result.success) {
      set({ currentOrganization: result.data, loading: false, error: null });
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  deleteOrganization: async (id) => {
    set({ loading: true, error: null });
    const result = await organizationService.deleteOrganization(id);
    if (result.success) {
      set((state) => ({
        organizations: state.organizations.filter((org) => org._id !== id),
        loading: false,
        error: null,
      }));
    } else {
      set({ loading: false, error: result.message });
    }
    return result;
  },

  updatePrimaryContact: async (id, newContactId) => {
    set({ loading: true, error: null });
    const result = await organizationService.updatePrimaryContact(id, newContactId);
    set({ loading: false, error: result.success ? null : result.message });
    return result;
  },

  clearError: () => set({ error: null }),
}));

export default useOrganizationStore;
