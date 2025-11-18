const express = require('express');
const router = express.Router();
const LeaderController = require('../../controllers/profile/leaderController');
const { authMiddleware, isAdmin } = require('../../controllers/admin-auth/authController'); 

router.post('/register', LeaderController.registerLeader);
router.post('/verify-email', LeaderController.verifyEmail);
router.use(authMiddleware, isAdmin); 
router.get('/:id', LeaderController.getLeaderById);
router.patch('/:id', LeaderController.updateLeader);
router.patch('/:id/score', LeaderController.updateLeaderScore);


module.exports = router;