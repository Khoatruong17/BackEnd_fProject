const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    phoneNumber: { type: String },
    address: { type: String },
    role: { type: String, enum: ['user', 'host', 'admin'] },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "role",
    },
    googleId: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: true }); 

module.exports = mongoose.model('User', userSchema);