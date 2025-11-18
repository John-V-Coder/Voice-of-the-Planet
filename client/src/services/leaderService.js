import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

class LeaderService {
  async registerLeader(leaderData) {
    try {
      const response = await fetch(API_ENDPOINTS.leaders.register, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leaderData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.leader };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async verifyEmail(email, code) {
    try {
      const response = await fetch(API_ENDPOINTS.leaders.verifyEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async getLeaderById(id) {
    try {
      const response = await fetch(API_ENDPOINTS.leaders.getById(id), {
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

  async updateLeader(id, updateData) {
    try {
      const response = await fetch(API_ENDPOINTS.leaders.update(id), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.leader };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async updateLeaderScore(id, scoreData) {
    try {
      const response = await fetch(API_ENDPOINTS.leaders.updateScore(id), {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(scoreData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.ecoScore };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }
}

export default new LeaderService();
