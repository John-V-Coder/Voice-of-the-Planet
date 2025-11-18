const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin-auth/authController.js'); 


router.post('/admin/request-code', authController.requestAdminLoginCode);
router.post('/admin/verify-code', authController.verifyAdminLoginCode);
router.get('/check', authController.authMiddleware, authController.checkAuth);
router.get('/admin/test', authController.authMiddleware, authController.isAdmin, (req, res) => {
    res.status(200).json({ success: true, message: "Welcome, Administrator! You have access.", user: req.user });
});


module.exports = router;