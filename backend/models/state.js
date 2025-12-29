const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    type: { type: String, required: true },
    location: {
        governorate: { type: String, required: true },
        district: { type: String, required: true },
        city: { type: String, required: true }
    },
    price: { type: Number, min: 0, required: true },
    contact: { type: String, required: true },
    seller: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: Array, required: true }
}, { timestamps: true });

module.exports = mongoose.model('State', stateSchema);