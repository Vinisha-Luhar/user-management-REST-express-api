const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },

    refreshTokenHash: {
        type: String,
        required: true,
        unique: true
    },

    expiresAt: {
        type: Date,
        required: true,
        index: true
    },

    revokedAt: {
        type: Date,
        default: null
    },

    lastUsedAt: {
        type: Date,
        default: null
    }
},
{
    timestamps: true
}
);

const session = mongoose.model("Session",sessionSchema);

module.exports = session;