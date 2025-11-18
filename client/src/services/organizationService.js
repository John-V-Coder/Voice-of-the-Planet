import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

class OrganizationService {
  async createOrganization(orgData) {
    try {
      const response = await fetch(API_ENDPOINTS.organizations.create, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orgData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.organization };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async getAllOrganizations() {
    try {
      const response = await fetch(API_ENDPOINTS.organizations.getAll, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: Array.isArray(data) ? data : [] };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async getOrganizationById(id) {
    try {
      const response = await fetch(API_ENDPOINTS.organizations.getById(id), {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async updateOrganization(id, updateData) {
    try {
      const response = await fetch(API_ENDPOINTS.organizations.update(id), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.organization };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async deleteOrganization(id) {
    try {
      const response = await fetch(API_ENDPOINTS.organizations.delete(id), {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async updatePrimaryContact(id, newContactId) {
    try {
      const response = await fetch(API_ENDPOINTS.organizations.updateContact(id), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newContactId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.organization };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }
}

export default new OrganizationService();
