const Organization = require('../../models/Organization');
const Leader = require('../../models/Leaders'); // Needed to validate/set primaryContact
const { generateUniqueId } = require('../../services/idGenerator'); // Assuming a utility exists for IDs

// --- CRUD Operations ---

/**
 * @route POST /api/organizations
 * Creates a new organization and links the primary contact (Leader).
 */
exports.createOrganization = async (req, res) => {
    try {
        const { primaryContactId, ...orgData } = req.body;

        // 1. Validate primary contact exists
        const primaryContact = await Leader.findById(primaryContactId);
        if (!primaryContact) {
            return res.status(404).json({ message: 'Primary contact Leader not found.' });
        }

        // 2. Generate unique ID for the organization
        const uniqueOrgId = generateUniqueId('ORG'); 

        const newOrganization = await Organization.create({
            ...orgData,
            uniqueOrgId,
            primaryContact: primaryContactId 
        });

        // 3. Optional: Update the Leader model to reference the new Organization
        primaryContact.organization = newOrganization._id;
        await primaryContact.save();

        res.status(201).json({ 
            message: 'Organization created successfully.', 
            organization: newOrganization 
        });
    } catch (error) {
        // Handle MongoDB validation or unique constraint errors
        res.status(400).json({ message: 'Failed to create organization.', error: error.message });
    }
};

/**
 * @route GET /api/organizations
 * Fetches a list of all organizations.
 */
exports.getAllOrganizations = async (req, res) => {
    try {
        // Populate primary contact's name and email for quick reference
        const organizations = await Organization.find({})
            .select('-registrationCode') // Hide sensitive field
            .populate('primaryContact', 'firstName lastName email'); 

        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organizations.', error: error.message });
    }
};

/**
 * @route GET /api/organizations/:id
 * Fetches a single organization by ID or uniqueOrgId.
 */
exports.getOrganizationById = async (req, res) => {
    const orgIdentifier = req.params.id;
    try {
        const organization = await Organization.findOne({
            $or: [{ _id: orgIdentifier }, { uniqueOrgId: orgIdentifier }]
        })
        .select('+registrationCode') // Explicitly select the hidden registrationCode
        .populate('primaryContact instructors', 'firstName lastName email'); 

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found.' });
        }

        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching organization.', error: error.message });
    }
};

/**
 * @route PATCH /api/organizations/:id
 * Updates an organization's details.
 */
exports.updateOrganization = async (req, res) => {
    const orgIdentifier = req.params.id;
    const updateData = req.body;
    try {
        // Prevent update of static/protected fields
        delete updateData.uniqueOrgId;
        delete updateData.stats;

        const updatedOrg = await Organization.findOneAndUpdate(
            { $or: [{ _id: orgIdentifier }, { uniqueOrgId: orgIdentifier }] },
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedOrg) {
            return res.status(404).json({ message: 'Organization not found for update.' });
        }

        res.status(200).json({ message: 'Organization updated.', organization: updatedOrg });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update organization.', error: error.message });
    }
};

/**
 * @route DELETE /api/organizations/:id
 * Marks an organization as inactive/suspended (Soft Delete).
 */
exports.deleteOrganization = async (req, res) => {
    const orgIdentifier = req.params.id;
    try {
        const result = await Organization.findOneAndUpdate(
            { $or: [{ _id: orgIdentifier }, { uniqueOrgId: orgIdentifier }] },
            { $set: { isActive: false, verificationStatus: 'suspended' } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ message: 'Organization not found for suspension.' });
        }

        res.status(200).json({ message: `Organization '${result.name}' successfully suspended.`, organization: result });
    } catch (error) {
        res.status(500).json({ message: 'Error suspending organization.', error: error.message });
    }
};

// --- Specialized Routes ---

/**
 * @route PATCH /api/organizations/:id/contact
 * Updates the organization's primary contact. Requires admin/org owner auth.
 */
exports.updatePrimaryContact = async (req, res) => {
    const orgIdentifier = req.params.id;
    const { newContactId } = req.body;

    // 1. Verify new contact is a valid Leader
    const newContact = await Leader.findById(newContactId);
    if (!newContact) {
        return res.status(404).json({ message: 'New primary contact Leader not found.' });
    }

    try {
        const organization = await Organization.findOneAndUpdate(
            { $or: [{ _id: orgIdentifier }, { uniqueOrgId: orgIdentifier }] },
            { $set: { primaryContact: newContactId } },
            { new: true }
        );

        if (!organization) {
            return res.status(404).json({ message: 'Organization not found.' });
        }

        res.status(200).json({ message: 'Primary contact updated successfully.', organization });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update primary contact.', error: error.message });
    }
};