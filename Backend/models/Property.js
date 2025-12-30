const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true }, // Vehicle, Real Estate, etc.
    location: { type: String, required: true },
    price: { type: Number, required: true },      // Total Valuation
    fractionPrice: { type: Number, required: true }, // Token Price
    roi: { type: String, required: true },        // e.g. "12.5"
    image: { type: String, required: true },
    totalTokens: { type: Number, default: 1000 },
    soldTokens: { type: Number, default: 0 },
    isSoldOut: { type: Boolean, default: false }
});

module.exports = mongoose.model('Property', PropertySchema);