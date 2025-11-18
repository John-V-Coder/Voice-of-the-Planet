const emailService = require('../../services/emailServices'); 
const EmailTemplate = require('../../models/EmailTemplate');
const { defaultTemplates } = require('../../utils/emailTemplete');

exports.seedDefaultTemplates = async (req, res) => {
    try {
        const results = await Promise.all(
            defaultTemplates.map(templateData =>
                EmailTemplate.findOneAndUpdate(
                    { name: templateData.name },
                    { $set: { ...templateData, isActive: true } },
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                )
            )
        );
        return res.status(200).json({
            message: 'Default email templates seeded/updated successfully.',
            count: results.length
        });
    } catch (error) {
        console.error('Error seeding templates:', error);
        return res.status(500).json({ message: 'Failed to seed templates', error: error.message });
    }
};

exports.getAllTemplates = async (req, res) => {
    try {
        const templates = await EmailTemplate.find({});
        return res.status(200).json(templates);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to fetch templates', error: error.message });
    }
};

exports.updateTemplate = async (req, res) => {
    const { name } = req.params;
    const updateData = req.body;
    try {
        const template = await EmailTemplate.findOneAndUpdate({ name }, updateData, { new: true });
        if (!template) {
            return res.status(404).json({ message: `Template '${name}' not found.` });
        }
        return res.status(200).json({ message: 'Template updated successfully', template });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to update template', error: error.message });
    }
};

exports.sendVerificationCode = async (req, res) => {
    const { recipientEmail, ...details } = req.body;
    if (!recipientEmail || !details.verificationCode) {
        return res.status(400).json({ message: 'Missing recipientEmail or verificationCode.' });
    }
    try {
        const success = await emailService.sendVerificationCode(recipientEmail, details);
        if (success) {
            return res.status(200).json({ message: 'Verification code email sent successfully.' });
        }
        return res.status(500).json({ message: 'Failed to send email (template missing or inactive).' });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending verification email', error: error.message });
    }
};

exports.sendWelcomeEmail = async (req, res) => {
    const { recipientEmail, ...details } = req.body;
    if (!recipientEmail || !details.firstName) {
        return res.status(400).json({ message: 'Missing recipientEmail or firstName.' });
    }
    try {
        const success = await emailService.sendWelcomeEmail(recipientEmail, details);
        if (success) {
            return res.status(200).json({ message: 'Welcome email sent successfully.' });
        }
        return res.status(500).json({ message: 'Failed to send email (template missing or inactive).' });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending welcome email', error: error.message });
    }
};

exports.sendTeamInvite = async (req, res) => {
    const { recipientEmail, ...details } = req.body;
    if (!recipientEmail || !details.teamCode) {
        return res.status(400).json({ message: 'Missing recipientEmail or teamCode.' });
    }
    try {
        const success = await emailService.sendTeamInvite(recipientEmail, details);
        if (success) {
            return res.status(200).json({ message: 'Team invitation email sent successfully.' });
        }
        return res.status(500).json({ message: 'Failed to send email (template missing or inactive).' });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending team invite email', error: error.message });
    }
};

exports.sendGenericNotification = async (req, res) => {
    const { recipientEmail, ...details } = req.body;
    if (!recipientEmail || !details.notificationSubject) {
        return res.status(400).json({ message: 'Missing recipientEmail or notificationSubject.' });
    }
    try {
        const success = await emailService.sendGenericNotification(recipientEmail, details);
        if (success) {
            return res.status(200).json({ message: 'Generic notification sent successfully.' });
        }
        return res.status(500).json({ message: 'Failed to send email (template missing or inactive).' });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending generic notification email', error: error.message });
    }
};

exports.sendSupportUpdate = async (req, res) => {
    const { recipientEmail, ...details } = req.body;
    if (!recipientEmail || !details.ticketId) {
        return res.status(400).json({ message: 'Missing recipientEmail or ticketId.' });
    }
    try {
        const success = await emailService.sendSupportUpdate(recipientEmail, details);
        if (success) {
            return res.status(200).json({ message: 'Support update email sent successfully.' });
        }
        return res.status(500).json({ message: 'Failed to send email (template missing or inactive).' });
    } catch (error) {
        return res.status(500).json({ message: 'Error sending support update email', error: error.message });
    }
};