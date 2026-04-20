const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiter");
const {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
} = require("../utils/email");

// POST /api/auth/register
router.post("/register", authLimiter, async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        const user = await User.create({ name, email, password });

        // Generate verification token
        const token = user.getEmailVerificationToken();
        await user.save({ validateBeforeSave: false });

        // Send verification email
        try {
            await sendVerificationEmail(user, token);
        } catch (emailErr) {
            console.error("Email send error:", emailErr);
            // Don't fail registration if email fails — but log it
            user.emailVerificationToken = undefined;
            user.emailVerificationExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }

        res.status(201).json({
            success: true,
            message: "Account created! Check your email to verify your account.",
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/verify-email/:token
router.get("/verify-email/:token", async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationExpire: { $gt: Date.now() },
        }).select("+emailVerificationToken +emailVerificationExpire");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Verification link is invalid or has expired. Please request a new one.",
            });
        }

        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save({ validateBeforeSave: false });

        // Send welcome email
        try {
            await sendWelcomeEmail(user);
        } catch (e) {
            console.error("Welcome email error:", e);
        }

        res.json({
            success: true,
            message: "Email verified successfully! Welcome to AMIANCE.",
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: true,
            },
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/resend-verification
router.post("/resend-verification", authLimiter, async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email }).select(
            "+emailVerificationToken +emailVerificationExpire"
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "No account found with this email" });
        }
        if (user.isVerified) {
            return res.status(400).json({ success: false, message: "Account is already verified" });
        }

        const token = user.getEmailVerificationToken();
        await user.save({ validateBeforeSave: false });
        await sendVerificationEmail(user, token);

        res.json({ success: true, message: "Verification email resent! Check your inbox." });
    } catch (err) {
        next(err);
    }
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
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        res.json({
            success: true,
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                phone: user.phone,
                bio: user.bio,
                avatar: user.avatar,
                addresses: user.addresses,
                preferences: user.preferences,
            },
        });
    } catch (err) {
        next(err);
    }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", authLimiter, async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // Don't reveal if email exists
            return res.json({
                success: true,
                message: "If that email is registered, a reset link has been sent.",
            });
        }

        const token = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });

        try {
            await sendPasswordResetEmail(user, token);
        } catch (e) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            return next(new Error("Could not send reset email. Please try again."));
        }

        res.json({
            success: true,
            message: "If that email is registered, a reset link has been sent.",
        });
    } catch (err) {
        next(err);
    }
});

// PUT /api/auth/reset-password/:token
router.put("/reset-password/:token", async (req, res, next) => {
    try {
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: { $gt: Date.now() },
        }).select("+resetPasswordToken +resetPasswordExpire");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Reset link is invalid or has expired",
            });
        }

        if (!req.body.password || req.body.password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters",
            });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({
            success: true,
            message: "Password reset successful",
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (err) {
        next(err);
    }
});

// GET /api/auth/me
router.get("/me", protect, async (req, res) => {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
});

module.exports = router;