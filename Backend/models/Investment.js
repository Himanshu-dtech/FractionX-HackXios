const mongoose = require('mongoose');

const InvestmentSchema = new mongoose.Schema({
    // This line links the investment to a specific User's ID
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
    
    assetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    assetName: String,
    amount: Number,
    tokens: Number,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Investment', InvestmentSchema);