const { sendMail } = require('../config/email');
const EmailTemplate = require('../models/EmailTemplate');

function replaceVariables(text, replacements) {
    if (!text) return '';
    let processedText = text;
    for (const [key, value] of Object.entries(replacements)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        processedText = processedText.replace(regex, String(value || ''));
    }
    return processedText;
}

class EmailService {

    // Default variables available in all templates
    getDefaultVariables(extraVars = {}) {
        return {
            companyName: process.env.COMPANY_NAME || 'Your Company',
            supportEmail: process.env.SUPPORT_EMAIL || 'support@yourdomain.com',
            websiteUrl: process.env.CLIENT_URL || 'https://example.com',
            currentYear: new Date().getFullYear(),
            ...extraVars // merge template-specific variables
        };
    }

    async sendTemplateEmail(templateName, recipientEmail, data = {}) {
        if (!templateName || !recipientEmail) {
            throw new Error("Missing required parameters for sending template email.");
        }

        // Merge default variables with template-specific data
        const fullData = this.getDefaultVariables(data);

        try {
            const template = await EmailTemplate.findOne({ name: templateName, isActive: true });

            if (!template) {
                console.warn(`Email template '${templateName}' not found or inactive. Skipping send to ${recipientEmail}.`);
                return false;
            }

            const subject = replaceVariables(template.subject, fullData);
            const htmlContent = replaceVariables(template.htmlContent, fullData);
            const textContent = replaceVariables(template.textContent, fullData);

            await sendMail(recipientEmail, subject, htmlContent, textContent);

            console.log(`Email '${templateName}' sent to ${recipientEmail}`);
            return true;
        } catch (error) {
            console.error(`EmailService failed to send '${templateName}' to ${recipientEmail}:`, error.message);
            throw new Error(`Failed to send email: ${templateName}`);
        }
    }

    async sendVerificationCode(recipientEmail, leaderDetails) {
        return this.sendTemplateEmail('registration-verification-code', recipientEmail, leaderDetails);
    }

    async sendWelcomeEmail(recipientEmail, leaderDetails) {
        return this.sendTemplateEmail('welcome-onboarding', recipientEmail, leaderDetails);
    }

    async sendTeamInvite(recipientEmail, inviteDetails) {
        return this.sendTemplateEmail('team-invitation-code', recipientEmail, inviteDetails);
    }

    async sendGenericNotification(recipientEmail, notificationDetails) {
        return this.sendTemplateEmail('generic-notification', recipientEmail, notificationDetails);
    }

    async sendSupportUpdate(recipientEmail, ticketDetails) {
        return this.sendTemplateEmail('support-ticket-update', recipientEmail, ticketDetails);
    }
}

module.exports = new EmailService();
