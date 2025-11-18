const jwt = require("jsonwebtoken");
const Leader = require("../../models/Leaders"); 
const emailService = require('../../services/emailServices');
const crypto = require('crypto');

// --- Utility ---

// Generate random 6-digit code for login
const generateLoginCode = () => {
    // Generate a secure random number and format it as a 6-digit string
    return crypto.randomInt(100000, 999999).toString();
};

// --- Authentication Steps ---

/**
 * @route POST /api/auth/admin/request-code
 * Step 1: Request Admin Login - Send Code to Email, ONLY if role is 'admin'.
 */
const requestAdminLoginCode = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }

        // 1. Find the Leader
        let leader = await Leader.findOne({ email });

        if (!leader) {
            return res.status(404).json({ success: false, message: "Account not found." });
        }

        // 2. CRITICAL: Enforce Admin Role check
        if (leader.role !== 'admin') {
             // Return a generic error message to avoid giving away specific account info
            return res.status(403).json({ success: false, message: "Unauthorized access attempt." });
        }

        // 3. Generate and save the login code with an expiration (e.g., 5 minutes)
        const loginCode = generateLoginCode();
        leader.verificationCode = {
            code: loginCode,
            expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
            isUsed: false,
            attempts: 0
        };
        await leader.save();

        // 4. Send the login code to the admin's email
        // Assuming emailService has a generic sendLoginCode template
        emailService
            .sendGenericNotification(leader.email, {
                firstName: leader.firstName,
                notificationSubject: 'Your Admin Login Code',
                notificationBody: `Your secure admin login code is: ${loginCode}. This code expires in 5 minutes.`,
                dashboardUrl: process.env.CLIENT_URL + '/admin/verify',
                companyName: process.env.COMPANY_NAME || 'Your Platform'
            })
            .catch((error) => {
                console.error(`Failed to send admin login code to ${leader.email}:`, error.message);
            });

        res.status(200).json({
            success: true,
            message: "A login code has been sent to the administrator email. Please check your inbox.",
        });
    } catch (error) {
        console.error("Request admin login code error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred. Please try again.",
            error: error.message,
        });
    }
};

/**
 * @route POST /api/auth/admin/verify-code
 * Step 2: Verify Login Code and Authenticate (for Admins).
 */
const verifyAdminLoginCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({ success: false, message: "Email and login code are required." });
        }

        const leader = await Leader.findOne({ email });

        if (!leader || leader.role !== 'admin' || !leader.verificationCode) {
            return res.status(400).json({ message: "Invalid credentials or unauthorized access." });
        }

        const verificationCode = leader.verificationCode;

        // Check if code has expired
        if (verificationCode.expiresAt < Date.now()) {
            leader.verificationCode = undefined;
            await leader.save();
            return res.status(400).json({ message: "Login code has expired. Please request a new one." });
        }

        // Check if code has been used or too many attempts
        if (verificationCode.isUsed || verificationCode.attempts >= 5) { 
            leader.verificationCode = undefined;
            await leader.save();
            return res.status(400).json({ message: "Login attempt blocked. Please request a new login code." });
        }

        // Validate the provided code
        if (verificationCode.code !== code) {
            leader.verificationCode.attempts += 1;
            await leader.save();
            return res.status(400).json({ message: `Invalid code. ${5 - leader.verificationCode.attempts} attempts remaining.` });
        }

        // ✅ Code is valid - generate JWT token
        const token = jwt.sign(
            {
                id: leader._id,
                role: leader.role,
                email: leader.email,
                uniqueUserId: leader.uniqueUserId,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Mark the code as used after successful login
        leader.verificationCode.isUsed = true;
        await leader.save();

        res.status(200).json({
            success: true,
            message: "Admin login successful!",
            token,
            user: {
                id: leader._id,
                uniqueUserId: leader.uniqueUserId,
                email: leader.email,
                role: leader.role,
            },
        });
    } catch (error) {
        console.error("Verify admin login code error:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred during verification. Please try again.",
            error: error.message,
        });
    }
};

// --- Middleware and Check Functions ---

/**
 * Middleware: Verifies the JWT token and attaches user data to req.user.
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized: No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const leader = await Leader.findById(decoded.id);

        if (!leader || !leader.isActive) {
            return res.status(401).json({ success: false, message: "Unauthorized: User account invalid or inactive." });
        }

        req.user = decoded; // Contains id, role, email, uniqueUserId
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Unauthorized: Token expired. Please log in again." });
        }
        return res.status(401).json({ success: false, message: "Unauthorized: Invalid token." });
    }
};

/**
 * Middleware: Ensures the authenticated user has the 'admin' role.
 * Should be placed AFTER authMiddleware.
 */
const isAdmin = (req, res, next) => {
    // Check the role extracted by authMiddleware
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: "Forbidden: Requires Administrator privileges." });
    }
};

/**
 * @route GET /api/auth/check
 * Checks authentication status (used for client-side persistence check).
 */
const checkAuth = async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({
            success: true,
            message: "Authenticated!",
            user: {
                id: user.id,
                uniqueUserId: user.uniqueUserId,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "An error occurred while checking authentication status." });
    }
};

module.exports = {
    requestAdminLoginCode,
    verifyAdminLoginCode,
    authMiddleware,
    isAdmin, // New admin-specific middleware
    checkAuth,
};