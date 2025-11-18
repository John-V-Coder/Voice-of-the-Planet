// models/Team.js
const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    
    // Link to the Parent Organization
    organizationId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Organization", 
        required: true, 
        index: true 
    },
    
    // Link to the Team Leader
    leaderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Leader", 
        required: true,
        index: true, 
    },
    
    // Key for members to join
    uniqueTeamCode: { 
        type: String, 
        required: true, 
        unique: true,
        uppercase: true 
    },
    
    // Denormalized stats for leaderboards
    stats: {
        totalMembers: { type: Number, default: 0 },
        totalEcoScore: { type: Number, default: 0 }
    },
    
    isActive: { type: Boolean, default: true }
}, { 
    timestamps: true 
});


module.exports = mongoose.model("Team", TeamSchema);