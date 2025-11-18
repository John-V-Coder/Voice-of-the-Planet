const Leader = require('../../models/Leaders');
const Organization = require('../../models/Organization'); 
const emailService = require('../../services/emailServices'); 
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const generateVerificationDetails = () => {
    const code = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); 
    return { code, expires };
};

// --- CRUD & Registration ---

/**
 * @route POST /api/leaders/register
 * Registers a new leader, hashes password, and sends verification email.
 */
exports.registerLeader = async (req, res) => {
    const { password, email, organizationId, ...rest } = req.body;
    try {
        // 1. Validate Organization ID
        const organization = await Organization.findById(organizationId);
        if (!organization || !organization.isActive) {
            return res.status(400).json({ message: 'Invalid or inactive organization ID.' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Generate Verification Code
        const { code, expires } = generateVerificationDetails();

        // 4. Create Leader
        let newLeader = await Leader.create({
            ...rest,
            email,
            password: hashedPassword,
            organizationId,
            verificationCode: code,
            verificationCodeExpires: expires,
        });

        // 5. Send Verification Email
        await emailService.sendVerificationCode(email, {
            firstName: newLeader.firstName,
            uniqueUserId: newLeader.uniqueUserId,
            verificationCode: code,
            expiryMinutes: 10,
            companyName: process.env.COMPANY_NAME || 'Your Platform',
        });

        // Remove sensitive data before sending response
        newLeader = newLeader.toObject();
        delete newLeader.password; 
        delete newLeader.verificationCode;

        res.status(201).json({ 
            message: 'Registration successful. Verification code sent to email.', 
            leader: newLeader 
        });

    } catch (error) {
        // Handle duplicate email/ID errors
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Email or User ID already exists.' });
        }
        res.status(500).json({ message: 'Failed to register leader.', error: error.message });
    }
};

/**
 * @route POST /api/leaders/verify-email
 * Verifies the user's email using the provided code.
 */
exports.verifyEmail = async (req, res) => {
    const { email, code } = req.body;

    try {
        const leader = await Leader.findOne({ email }).select('+verificationCode +verificationCodeExpires');
        
        if (!leader) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // 1. Check if the code is correct and not expired
        if (leader.verificationCode !== code || leader.verificationCodeExpires < new Date()) {
            return res.status(400).json({ message: 'Invalid or expired verification code.' });
        }

        // 2. Update status and remove code
        leader.isEmailVerified = true;
        leader.verificationCode = undefined;
        leader.verificationCodeExpires = undefined;
        await leader.save();

        // 3. Send welcome email (optional, for successful verification)
        await emailService.sendWelcomeEmail(email, {
            firstName: leader.firstName,
            organizationName: leader.organizationId, // Replace with actual name if populated
            uniqueUserId: leader.uniqueUserId,
            role: leader.role,
            loginUrl: process.env.CLIENT_URL + '/dashboard',
            companyName: process.env.COMPANY_NAME || 'Your Platform',
        });

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Verification failed.', error: error.message });
    }
};

/**
 * @route GET /api/leaders/:id
 * Fetches a single leader by ID or uniqueUserId.
 */
exports.getLeaderById = async (req, res) => {
    const leaderIdentifier = req.params.id;
    try {
        const leader = await Leader.findOne({
            $or: [{ _id: leaderIdentifier }, { uniqueUserId: leaderIdentifier }]
        })
        .select('-password -verificationCode -verificationCodeExpires') // Remove sensitive data
        .populate('organizationId', 'name uniqueOrgId')
        .populate('teamId', 'name');

        if (!leader) {
            return res.status(404).json({ message: 'Leader not found.' });
        }

        res.status(200).json(leader);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching leader.', error: error.message });
    }
};

/**
 * @route PATCH /api/leaders/:id
 * Updates a leader's public details (not including password or email).
 */
exports.updateLeader = async (req, res) => {
    const leaderIdentifier = req.params.id;
    const updateData = req.body;

    // Prevent direct modification of protected fields
    delete updateData.email;
    delete updateData.password;
    delete updateData.uniqueUserId;

    try {
        const updatedLeader = await Leader.findOneAndUpdate(
            { $or: [{ _id: leaderIdentifier }, { uniqueUserId: leaderIdentifier }] },
            { $set: updateData },
            { new: true, runValidators: true }
        )
        .select('-password -verificationCode -verificationCodeExpires');

        if (!updatedLeader) {
            return res.status(404).json({ message: 'Leader not found for update.' });
        }

        res.status(200).json({ message: 'Leader profile updated.', leader: updatedLeader });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update leader.', error: error.message });
    }
};

/**
 * @route PATCH /api/leaders/:id/score
 * Updates a leader's EcoScore attributes (only via authorized route).
 */
exports.updateLeaderScore = async (req, res) => {
    const leaderIdentifier = req.params.id;
    const { knowledge, skill, consistency } = req.body;
    
    // Only allow specific ecoScore fields to be updated
    const update = {};
    if (knowledge !== undefined) update['ecoScore.knowledge'] = knowledge;
    if (skill !== undefined) update['ecoScore.skill'] = skill;
    if (consistency !== undefined) update['ecoScore.consistency'] = consistency;

    try {
        const updatedLeader = await Leader.findOneAndUpdate(
            { $or: [{ _id: leaderIdentifier }, { uniqueUserId: leaderIdentifier }] },
            { $set: update },
            { new: true, runValidators: true }
        ).select('ecoScore');

        if (!updatedLeader) {
            return res.status(404).json({ message: 'Leader not found.' });
        }

        // The pre-save hook handles calculating the new ecoScore.total
        res.status(200).json({ 
            message: 'EcoScore updated successfully.', 
            ecoScore: updatedLeader.ecoScore 
        });
    } catch (error) {
        res.status(400).json({ message: 'Failed to update EcoScore.', error: error.message });
    }
};