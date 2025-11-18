const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  auth: {
    requestAdminCode: `${API_BASE_URL}/api/auth/admin/request-code`,
    verifyAdminCode: `${API_BASE_URL}/api/auth/admin/verify-code`,
    checkAuth: `${API_BASE_URL}/api/auth/check`,
  },
  leaders: {
    register: `${API_BASE_URL}/api/leaders/register`,
    verifyEmail: `${API_BASE_URL}/api/leaders/verify-email`,
    getById: (id) => `${API_BASE_URL}/api/leaders/${id}`,
    update: (id) => `${API_BASE_URL}/api/leaders/${id}`,
    updateScore: (id) => `${API_BASE_URL}/api/leaders/${id}/score`,
  },
  teams: {
    create: `${API_BASE_URL}/api/teams`,
    join: `${API_BASE_URL}/api/teams/join`,
    getMembers: (id) => `${API_BASE_URL}/api/teams/${id}/members`,
    sendInvite: (id) => `${API_BASE_URL}/api/teams/${id}/invite`,
  },
  organizations: {
    create: `${API_BASE_URL}/api/organizations`,
    getAll: `${API_BASE_URL}/api/organizations`,
    getById: (id) => `${API_BASE_URL}/api/organizations/${id}`,
    update: (id) => `${API_BASE_URL}/api/organizations/${id}`,
    delete: (id) => `${API_BASE_URL}/api/organizations/${id}`,
    updateContact: (id) => `${API_BASE_URL}/api/organizations/${id}/contact`,
  },
  emails: {
    seedTemplates: `${API_BASE_URL}/api/emails/templates/seed`,
    getAllTemplates: `${API_BASE_URL}/api/emails/templates`,
    updateTemplate: (name) => `${API_BASE_URL}/api/emails/templates/${name}`,
    sendVerificationCode: `${API_BASE_URL}/api/emails/send/verification-code`,
    sendWelcome: `${API_BASE_URL}/api/emails/send/welcome`,
    sendTeamInvite: `${API_BASE_URL}/api/emails/send/team-invite`,
    sendNotification: `${API_BASE_URL}/api/emails/send/notification`,
    sendSupportUpdate: `${API_BASE_URL}/api/emails/send/support-update`,
  },
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    return 'No response from server. Please check your connection.';
  } else {
    return error.message || 'An unexpected error occurred';
  }
};
