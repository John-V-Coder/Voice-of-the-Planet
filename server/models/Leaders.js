// models/Leader.js
const mongoose = require('mongoose');
const { getNextSequenceValue } = require('../services/idGenerator'); 
const Organization = require('./Organization');

const LeaderSchema = new mongoose.Schema({
    uniqueUserId: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true,
        index: true 
    }, 
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    password: { 
        type: String, 
        required: true, 
        select: false 
    }, 
    email: { 
        type: String, 
        lowercase: true, 
        trim: true,
        unique: true, 
        sparse: true, 
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        required: true 
    },
    phone: String,
    
    isEmailVerified: {
        type: Boolean,
        default: false, 
    },
    verificationCode: {
        type: String, 
        select: false,
    },
    verificationCodeExpires: {
        type: Date, 
        select: false,
    },
    
    organizationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Organization", 
        required: true,
        index: true
    },
    teamId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Team",
        index: true 
    },
    
    role: { 
        type: String, 
        enum: ["student", "instructor", "alumni", "team_leader", "admin"], 
        required: true,
        default: "student" 
    },
    
    currentPath: { 
        type: String, 
        enum: ["full_journey", "nursery_specialist", "field_forester", "none"],
        default: "none"
    },
    currentStage: { type: Number, default: 0 },
    
    ecoScore: {
        total: { type: Number, default: 0, index: -1 }, 
        knowledge: { type: Number, default: 0 },      
        skill: { type: Number, default: 0 },           
        consistency: { type: Number, default: 0 }     
    },
    
    badges: [{ 
        badgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },
        earnedAt: Date
    }],
    
    streakCount: { type: Number, default: 0 },
    lastActiveDate: Date,
    achievementTier: { 
        type: String, 
        enum: ["bronze", "silver", "gold", "none"], 
        default: "none" 
    },
    parentalConsent: { type: Boolean, default: false }, 
    privacySettings: {
        showOnLeaderboard: { type: Boolean, default: true },
        shareWithTeam: { type: Boolean, default: true }
    },
    
    isActive: { type: Boolean, default: true }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true } 
});

LeaderSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
});

LeaderSchema.pre('save', async function(next) {
    const leader = this; 
    
    if (leader.isNew && !leader.uniqueUserId) {
        try {
            const orgId = leader.organizationId.toString();
            
            const sequence = await getNextSequenceValue(orgId);
            const paddedSequence = String(sequence).padStart(4, '0');

            const orgPrefix = orgId.substring(orgId.length - 4).toUpperCase(); 
            
            leader.uniqueUserId = `LDR-${paddedSequence}-${orgPrefix}`;
            
        } catch (error) {
            console.error("Error generating uniqueUserId:", error);
            return next(new Error("Failed to generate unique user ID.")); 
        }
    }

    if (leader.isModified('ecoScore.knowledge') || leader.isModified('ecoScore.skill') || leader.isModified('ecoScore.consistency')) {
        const knowledge = leader.ecoScore.knowledge || 0;
        const skill = leader.ecoScore.skill || 0;
        const consistency = leader.ecoScore.consistency || 0;
        
        leader.ecoScore.total = (0.3 * knowledge) + (0.5 * skill) + (0.2 * consistency);
    }
    
    next();
});

LeaderSchema.index({ organizationId: 1, role: 1 });
LeaderSchema.index({ "ecoScore.total": -1 }); 

module.exports = mongoose.model("Leader", LeaderSchema);