const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const { admin } = require("../middleware/admin");

// GET /api/users/profile
router.get("/profile", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, user });
    } catch (err) { next(err); }
});

// PUT /api/users/profile
router.put("/profile", protect, async (req, res, next) => {
    try {
        const { name, email, phone, bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { name, email, phone, bio },
            { new: true, runValidators: true }
        );
        res.json({ success: true, user });
    } catch (err) { next(err); }
});

// PUT /api/users/password
router.put("/password", protect, async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select("+password");

        if (!(await user.matchPassword(currentPassword))) {
            return res.status(401).json({ success: false, message: "Current password is incorrect" });
        }

        user.password = newPassword;
        await user.save();
        res.json({ success: true, message: "Password updated" });
    } catch (err) { next(err); }
});

// POST /api/users/addresses
router.post("/addresses", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.addresses.length === 0) req.body.isDefault = true;
        user.addresses.push(req.body);
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (err) { next(err); }
});

// PUT /api/users/addresses/:addrId
router.put("/addresses/:addrId", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const addr = user.addresses.id(req.params.addrId);
        if (!addr) return res.status(404).json({ success: false, message: "Address not found" });
        Object.assign(addr, req.body);
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (err) { next(err); }
});

// DELETE /api/users/addresses/:addrId
router.delete("/addresses/:addrId", protect, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addrId);
        await user.save();
        res.json({ success: true, addresses: user.addresses });
    } catch (err) { next(err); }
});

// GET /api/users — admin only
router.get("/", protect, admin, async (req, res, next) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json({ success: true, users });
    } catch (err) { next(err); }
});

module.exports = router;