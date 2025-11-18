const Team = require('../../models/Team');
const Organization = require('../../models/Organization'); // For validation
const Leader = require('../../models/Leaders'); // For adding/removing members and leader assignment
const emailService = require('../../services/emailServices'); 
const crypto = require('crypto');

// --- Helper Functions ---

/**
 * Generates a unique, short code for team joining.
 */
const generateTeamCode = () => {
    // Generate a 6-character alphanumeric code
    return crypto.randomBytes(3).toString('hex').toUpperCase(); 
};

// --- CRUD & Management ---

/**
 * @route POST /api/teams
 * Creates a new team, validates the organization/leader, and sets the team code.
 * Requires: organizationId, leaderId, name
 */
exports.createTeam = async (req, res) => {
    const { name, organizationId, leaderId } = req.body;
    try {
        // 1. Validate Organization and Leader exist
        const [organization, leader] = await Promise.all([
            Organization.findById(organizationId),
            Leader.findById(leaderId),
        ]);

        if (!organization || !organization.isActive) {
            return res.status(404).json({ message: 'Organization not found or is inactive.' });
        }
        if (!leader) {
            return res.status(404).json({ message: 'Leader not found.' });
        }

        // 2. Ensure leader isn't already leading a team (optional but recommended)
        const existingTeam = await Team.findOne({ leaderId });
        if (existingTeam) {
             return res.status(400).json({ message: 'This leader is already assigned as the leader of another team.' });
        }
        
        // 3. Create Team
        const uniqueTeamCode = generateTeamCode();
        let newTeam = await Team.create({
            name,
            organizationId,
            leaderId,
            uniqueTeamCode,
            stats: { totalMembers: 1 } // Leader is the first member
        });

        // 4. Assign the leader to the new team
        leader.teamId = newTeam._id;
        leader.role = 'team_leader'; // Update role automatically
        await leader.save();

        res.status(201).json({ 
            message: 'Team created and leader assigned successfully.', 
            team: newTeam 
        });

    } catch (error) {
        res.status(400).json({ message: 'Failed to create team.', error: error.message });
    }
};

/**
 * @route POST /api/teams/join
 * Allows a leader (user) to join a team using a unique team code.
 * Requires: leaderId, uniqueTeamCode
 */
exports.joinTeamByCode = async (req, res) => {
    const { leaderId, uniqueTeamCode } = req.body;

    try {
        const team = await Team.findOne({ uniqueTeamCode: uniqueTeamCode.toUpperCase(), isActive: true });
        const leader = await Leader.findById(leaderId);

        if (!team || !leader) {
            return res.status(404).json({ message: 'Team or Leader not found.' });
        }

        // 1. Check if leader is already on a team
        if (leader.teamId && leader.teamId.toString() === team._id.toString()) {
            return res.status(400).json({ message: 'Leader is already a member of this team.' });
        }
        
        // 2. Update Leader's teamId and Organization ID (if different)
        leader.teamId = team._id;
        leader.organizationId = team.organizationId; // Enforce organization alignment
        await leader.save();

        // 3. Update Team stats
        await Team.findByIdAndUpdate(team._id, { 
            $inc: { 'stats.totalMembers': 1 } 
        });

        res.status(200).json({ 
            message: `Successfully joined team ${team.name}.`, 
            teamId: team._id 
        });

    } catch (error) {
        res.status(500).json({ message: 'Failed to join team.', error: error.message });
    }
};


/**
 * @route GET /api/teams/:id/members
 * Fetches all leaders belonging to a specific team.
 */
exports.getTeamMembers = async (req, res) => {
    const teamId = req.params.id;

    try {
        // Find all leaders whose teamId matches the teamId
        const members = await Leader.find({ teamId })
            .select('uniqueUserId firstName lastName email role ecoScore.total lastActiveDate')
            .sort({ 'ecoScore.total': -1 });

        if (!members || members.length === 0) {
             // Team may exist but has no members (only the leader)
            return res.status(200).json({ message: 'Team has no registered members yet.', members: [] });
        }
        
        res.status(200).json(members);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching team members.', error: error.message });
    }
};

/**
 * @route POST /api/teams/:id/invite
 * Sends an email invitation with the unique team code.
 * Requires: inviteeEmail, inviterName (from auth)
 */
exports.sendTeamInvite = async (req, res) => {
    const teamId = req.params.id;
    const { inviteeEmail, inviterName } = req.body; // inviterName comes from the currently authenticated user

    try {
        const team = await Team.findById(teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found.' });
        }

        // 1. Find the organization name
        const organization = await Organization.findById(team.organizationId).select('name');

        // 2. Send Invitation Email
        await emailService.sendTeamInvite(inviteeEmail, {
            firstName: 'there', // Generic greeting for external invite
            inviterName: inviterName || 'The Team Leader', 
            teamName: team.name,
            organizationName: organization ? organization.name : 'Unknown Organization',
            teamCode: team.uniqueTeamCode,
            appUrl: process.env.CLIENT_URL,
        });

        res.status(200).json({ message: `Invitation sent to ${inviteeEmail} successfully.` });

    } catch (error) {
        res.status(500).json({ message: 'Failed to send team invitation.', error: error.message });
    }
};