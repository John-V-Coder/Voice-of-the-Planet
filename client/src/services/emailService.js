import { API_ENDPOINTS, getAuthHeaders, handleApiError } from '../config/api';

class EmailService {
  async seedTemplates() {
    try {
      const response = await fetch(API_ENDPOINTS.emails.seedTemplates, {
        method: 'POST',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message, count: data.count };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async getAllTemplates() {
    try {
      const response = await fetch(API_ENDPOINTS.emails.getAllTemplates, {
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

  async updateTemplate(name, templateData) {
    try {
      const response = await fetch(API_ENDPOINTS.emails.updateTemplate(name), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(templateData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, data: data.template };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async sendVerificationCode(recipientEmail, details) {
    try {
      const response = await fetch(API_ENDPOINTS.emails.sendVerificationCode, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ recipientEmail, ...details }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async sendWelcomeEmail(recipientEmail, details) {
    try {
      const response = await fetch(API_ENDPOINTS.emails.sendWelcome, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ recipientEmail, ...details }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async sendTeamInvite(recipientEmail, details) {
    try {
      const response = await fetch(API_ENDPOINTS.emails.sendTeamInvite, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ recipientEmail, ...details }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async sendNotification(recipientEmail, details) {
    try {
      const response = await fetch(API_ENDPOINTS.emails.sendNotification, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ recipientEmail, ...details }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }

  async sendSupportUpdate(recipientEmail, details) {
    try {
      const response = await fetch(API_ENDPOINTS.emails.sendSupportUpdate, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ recipientEmail, ...details }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      return { success: false, message: handleApiError(error) };
    }
  }
}

export default new EmailService();
