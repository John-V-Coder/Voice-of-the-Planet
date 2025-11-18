// models/Organization.js
const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true,
        index: true 
    },
    uniqueOrgId: { 
        type: String, 
        required: true, 
        unique: true, 
        uppercase: true,
    },
    type: { 
        type: String, 
        enum: ["school", "club", "community", "alumni", "ngo"], 
        required: true 
    },
    registrationCode: { 
        type: String, 
        unique: true, 
        sparse: true, 
        select: false 
    },
    location: {
        county: { type: String, trim: true, index: true },
        subcounty: { type: String, trim: true },
        ward: { type: String, trim: true },
        address: { type: String, trim: true },
        geo: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], 
                default: [0, 0]
            }
        }
    },
    contactInfo: {
        email: { 
            type: String, 
            trim: true, 
            lowercase: true, 
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] 
        },
        phone: String,
        website: String
    },
    // References to the Leader model
    primaryContact: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Leader", 
        required: true 
    },
    instructors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Leader" }], 
    stats: {
        totalMembers: { type: Number, default: 0 },
        totalEcoScore: { type: Number, default: 0 },
        totalTreesPlanted: { type: Number, default: 0 },
        activeTeams: { type: Number, default: 0 }
    },
    isActive: { type: Boolean, default: true },
    verificationStatus: { 
        type: String, 
        enum: ["pending", "verified", "suspended"], 
        default: "pending" 
    },
    adminNotes: String, 
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

OrganizationSchema.index({ "location.geo": '2dsphere' });

OrganizationSchema.pre('save', function(next) {
    if (this.location.geo && this.location.geo.coordinates.length === 0) {
        this.location.geo.coordinates = [0, 0];
    }
    next();
});

module.exports = mongoose.model("Organization", OrganizationSchema);