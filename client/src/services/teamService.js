import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

class TeamService {
  async createTeam(teamData) {
    try {
      const response = await fetch(API_ENDPOINTS.teams.create, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(teamData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.team };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async joinTeamByCode(leaderId, uniqueTeamCode) {
    try {
      const response = await fetch(API_ENDPOINTS.teams.join, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ leaderId, uniqueTeamCode }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message, teamId: data.teamId };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async getTeamMembers(teamId) {
    try {
      const response = await fetch(API_ENDPOINTS.teams.getMembers(teamId), {
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

  async sendTeamInvite(teamId, inviteeEmail, inviterName) {
    try {
      const response = await fetch(API_ENDPOINTS.teams.sendInvite(teamId), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ inviteeEmail, inviterName }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }
}

export default new TeamService();
