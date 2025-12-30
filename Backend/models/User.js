const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, default: "Guest User" },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 5000000 }, // Default ₹50 Lakhs
    phone: { type: String, default: "" },
    location: { type: String, default: "" },
    bio: { type: String, default: "Crypto Investor" },
    isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);