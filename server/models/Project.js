const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    collaborators: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', // Assuming you have a User model
            required: true
        },
        role: {
            type: String,
            enum: ['owner', 'editor', 'viewer'],
            default: 'editor'
        }
    }],
    files: [{
        filename: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    realTimeFeatures: {
        chatEnabled: {
            type: Boolean,
            default: true
        },
        notificationsEnabled: {
            type: Boolean,
            default: true
        },
        lastUpdated: {
            type: Date,
            default: Date.now
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);