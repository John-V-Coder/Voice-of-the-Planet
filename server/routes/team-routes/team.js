const express = require('express');
const router = express.Router();
const teamController = require('../../controllers/profile/teamcontroller');
const { authMiddleware, isAdmin } = require('../../controllers/admin-auth/authController'); 


router.post('/join', authMiddleware, teamController.joinTeamByCode);
router.use(authMiddleware);
router.post('/', teamController.createTeam);
router.get('/:id/members', teamController.getTeamMembers);
router.post('/:id/invite', teamController.sendTeamInvite);


module.exports = router;