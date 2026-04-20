const express = require("express");
const router = express.Router();
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");

// POST /api/auth/register
router.post("/register", authLimiter, async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }
        const user = await User.create({ name, email, password });
        res.status(201).json({
            success: true,
            token: generateToken(user._id),
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) { next(err); }
});

// POST /api/auth/login
router.post("/login", authLimiter, async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please provide email and password" });
        }
        const user = await User.findOne({ email }).select("+password");
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }
        res.json({
            success: true,
            token: generateToken(user._id),
            user: { _id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err) { next(err); }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;