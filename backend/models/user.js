const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true },
    properties: [
        {
            propertyId: { type: mongoose.Schema.Types.ObjectId, required: true },
            type: { type: String },
            price: { type: Number },
            contact: { type: String },
            seller: { type: String },
            location: {
                governorate: String,
                district: String,
                city: String,
            },
            images: [{ type: String }],
            createdAt: { type: Date, default: Date.now },
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

