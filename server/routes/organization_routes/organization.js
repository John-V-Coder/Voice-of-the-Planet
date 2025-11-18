const express = require('express');
const router = express.Router();
const organizationController = require('../../controllers/profile/organizationController');
const { authMiddleware, isAdmin } = require('../../controllers/admin-auth/authController'); 


router.use(authMiddleware);
router.use(isAdmin);
router.post('/', organizationController.createOrganization);
router.get('/', organizationController.getAllOrganizations);
router.get('/:id', organizationController.getOrganizationById);
router.patch('/:id', organizationController.updateOrganization);
router.delete('/:id', organizationController.deleteOrganization);
router.patch('/:id/contact', organizationController.updatePrimaryContact);


module.exports = router;