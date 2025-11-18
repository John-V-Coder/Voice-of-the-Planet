import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

class AuthService {
  async requestAdminLoginCode(email) {
    try {
      const response = await fetch(API_ENDPOINTS.auth.requestAdminCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async verifyAdminLoginCode(email, code) {
    try {
      const response = await fetch(API_ENDPOINTS.auth.verifyAdminCode, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      if (data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }

      return { success: true, data: data.user, token: data.token };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async checkAuth() {
    try {
      const response = await fetch(API_ENDPOINTS.auth.checkAuth, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  getStoredUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getStoredToken() {
    return localStorage.getItem('authToken');
  }

  isAuthenticated() {
    return !!this.getStoredToken();
  }
}

export default new AuthService();
