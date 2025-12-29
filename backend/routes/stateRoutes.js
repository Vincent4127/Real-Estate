const express = require('express');
const router = express.Router();
const State = require('../models/state');
const User = require('../models/user')
const upload = require("../middleware/uploads");

router.get('/', async (req, res) => {
    try {
        const states = await State.find()
        res.json(states);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

router.post("/:userId", upload.array("images", 10), async (req, res) => {
    const { type, price, contact, seller, description } = req.body;
    const { userId } = req.params;
    const location =
        req.body.location && typeof req.body.location === "string"
            ? JSON.parse(req.body.location)
            : req.body.location;

    try {

        if (!type) return res.status(500).json({ error: "type is required" });
        if (price === undefined || price === null) return res.status(500).json({ error: "price is required" });

        const user = await User.findById(userId);
        if (!user) return res.status(401).json({ error: "User not found" });

        const imagePaths = (req.files || []).map((f) => `/uploads/${f.filename}`);

        const newState = new State({
            type,
            location,
            price,
            contact,
            seller,
            description,
            images: imagePaths,
        });

        const savedState = await newState.save();

        const embedded = {
            propertyId: newState._id,
            type: newState.type,
            price: newState.price,
            contact: newState.contact,
            seller: newState.seller,
            location: newState.location,
            images: newState.images,
            createdAt: new Date(),
        };

        await User.findByIdAndUpdate(user._id, {
            $push: { properties: embedded }
        });

        console.log("BODY:", req.body);
        console.log("FILES:", req.files);

        res.status(200).json(savedState);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message, errors: error.errors });
    }
});

router.delete("/:propertyId", async (req, res) => {
    const { propertyId } = req.params;

    try {
        const deleted = await State.findByIdAndDelete(propertyId);
        if (!deleted) {
            return res.status(404).json({ error: "Property not found" });
        }

        await User.updateMany(
            {},
            { $pull: { properties: { propertyId } } }
        );

        res.json({ success: true, message: "Property deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




module.exports = router;