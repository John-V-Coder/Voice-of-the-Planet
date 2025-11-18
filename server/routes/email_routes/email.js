const express = require("express");
const router = express.Router();

const {
    seedDefaultTemplates,
    getAllTemplates,
    updateTemplate,
    sendVerificationCode,
    sendWelcomeEmail,
    sendTeamInvite,
    sendGenericNotification,
    sendSupportUpdate
} = require("../../controllers/email/emailController");

// ===============================
// TEMPLATE MANAGEMENT ROUTES
// ===============================

// Seed or update default email templates
router.post("/templates/seed", seedDefaultTemplates);

// Get all templates
router.get("/templates", getAllTemplates);

// Update a specific template by name
router.put("/templates/:name", updateTemplate);

// ===============================
// EMAIL SENDING ROUTES
// ===============================

// Send verification code email
router.post("/send/verification-code", sendVerificationCode);

// Send welcome email
router.post("/send/welcome", sendWelcomeEmail);

// Send team invite email
router.post("/send/team-invite", sendTeamInvite);

// Send generic notification
router.post("/send/notification", sendGenericNotification);

// Send support ticket update email
router.post("/send/support-update", sendSupportUpdate);

module.exports = router;
